import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openaiWs: WebSocket | null = null;
  let projectId: string | null = null;

  socket.onopen = () => {
    console.log("Client connected");
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Received message type:", message.type);

      if (message.type === "init") {
        projectId = message.projectId;
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const openaiKey = Deno.env.get('OPENAI_API_KEY');

        if (!openaiKey) {
          socket.send(JSON.stringify({ type: "error", error: "OpenAI API key not configured" }));
          return;
        }

        const supabase = createClient(supabaseUrl!, supabaseKey!);

        // Load chatbot config and knowledge base
        const { data: config } = await supabase
          .from('chatbot_config')
          .select('*')
          .eq('project_id', projectId)
          .single();

        const { data: deliverable } = await supabase
          .from('deliverables')
          .select('content')
          .eq('project_id', projectId)
          .eq('content_type', 'chatbot')
          .single();

        let systemPrompt = "You are a helpful AI assistant.\n\n";
        
        if (deliverable?.content) {
          const kb = deliverable.content as any;
          if (kb.product_info) {
            systemPrompt += `Product Information:\n${JSON.stringify(kb.product_info, null, 2)}\n\n`;
          }
          if (kb.common_questions) {
            systemPrompt += `Common Questions:\n`;
            kb.common_questions.forEach((qa: any) => {
              systemPrompt += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
            });
          }
        }

        if (config?.response_style) {
          systemPrompt += `\nResponse style: ${config.response_style}`;
        }

        // Connect to OpenAI Realtime API
        const openaiUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17";
        openaiWs = new WebSocket(openaiUrl, {
          headers: {
            "Authorization": `Bearer ${openaiKey}`,
            "OpenAI-Beta": "realtime=v1",
          },
        });

        openaiWs.onopen = () => {
          console.log("Connected to OpenAI");
          openaiWs!.send(JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: systemPrompt,
              voice: config?.voice_name || "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: config?.temperature || 0.7,
            }
          }));
        };

        openaiWs.onmessage = (openaiEvent) => {
          const data = JSON.parse(openaiEvent.data);
          console.log("OpenAI message type:", data.type);
          socket.send(openaiEvent.data);
        };

        openaiWs.onerror = (error) => {
          console.error("OpenAI WebSocket error:", error);
          socket.send(JSON.stringify({ type: "error", error: "OpenAI connection error" }));
        };

        openaiWs.onclose = () => {
          console.log("OpenAI connection closed");
        };

        socket.send(JSON.stringify({ type: "ready" }));
      } else if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error processing message:", errorMsg);
      socket.send(JSON.stringify({ type: "error", error: errorMsg }));
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    if (openaiWs) {
      openaiWs.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Socket error:", error);
    if (openaiWs) {
      openaiWs.close();
    }
  };

  return response;
});