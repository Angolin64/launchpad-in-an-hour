import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, message, conversationHistory = [] } = await req.json();
    
    console.log('Chatbot request:', { projectId, message });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load chatbot configuration
    const { data: config } = await supabase
      .from('chatbot_config')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    // Fetch the chatbot knowledge base
    const { data: deliverable, error: deliverableError } = await supabase
      .from('deliverables')
      .select('content')
      .eq('project_id', projectId)
      .eq('content_type', 'chatbot')
      .single();

    if (deliverableError) {
      console.error('Error fetching chatbot data:', deliverableError);
      throw new Error('Chatbot knowledge base not found');
    }

    const knowledgeBase = deliverable.content;
    console.log('Knowledge base loaded');

    // Build system prompt from knowledge base and config
    let systemPrompt = `You are a helpful AI assistant for the product/service described below.\n\n`;
    
    if (knowledgeBase.greeting) {
      systemPrompt += `Greeting: ${knowledgeBase.greeting}\n\n`;
    }
    
    if (knowledgeBase.product_info) {
      systemPrompt += `Product Information:\n${JSON.stringify(knowledgeBase.product_info, null, 2)}\n\n`;
    }
    
    if (knowledgeBase.common_questions && knowledgeBase.common_questions.length > 0) {
      systemPrompt += `Common Questions & Answers:\n`;
      knowledgeBase.common_questions.forEach((qa: any) => {
        systemPrompt += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
      });
    }

    const responseStyle = config?.response_style || 'friendly';
    systemPrompt += `\nInstructions:
- Be ${responseStyle} in your responses
- Use the product information and common questions above to answer user queries
- If you don't know something, be honest about it
- Keep responses clear and actionable
- Stay in character as a customer support assistant`;

    console.log('System prompt created, calling Lovable AI...');

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const aiModel = config?.ai_model || 'google/gemini-2.5-flash';
    const temperature = config?.temperature || 0.7;
    const maxTokens = config?.max_tokens || 500;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const aiData = await response.json();
    const aiMessage = aiData.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    console.log('AI response received:', aiMessage.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({
        message: aiMessage,
        success: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in chatbot function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
