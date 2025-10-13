import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, message, threadId, customerEmail } = await req.json();

    if (!projectId || !message) {
      throw new Error('projectId and message are required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project to get vector_store_id
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('vector_store_id, name')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found or no vector store configured');
    }

    if (!project.vector_store_id) {
      throw new Error('Vector store not configured for this project. Please add a vector_store_id.');
    }

    let currentThreadId = threadId;
    let sessionId = null;

    // Create or retrieve thread
    if (!currentThreadId) {
      console.log('Creating new thread...');
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          tool_resources: {
            file_search: {
              vector_store_ids: [project.vector_store_id]
            }
          }
        }),
      });

      if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        console.error('Thread creation failed:', errorText);
        throw new Error(`Failed to create thread: ${errorText}`);
      }

      const threadData = await threadResponse.json();
      currentThreadId = threadData.id;
      console.log('Thread created:', currentThreadId);

      // Save session
      const { data: session, error: sessionError } = await supabase
        .from('ai_chat_sessions')
        .insert({
          project_id: projectId,
          thread_id: currentThreadId,
          customer_email: customerEmail,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Failed to save session:', sessionError);
      } else {
        sessionId = session.id;
      }
    }

    // Add message to thread
    console.log('Adding message to thread...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: message,
      }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error('Message creation failed:', errorText);
      throw new Error(`Failed to add message: ${errorText}`);
    }

    // Create assistant if needed
    console.log('Creating/using assistant...');
    const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        name: `${project.name} Customer Service`,
        instructions: `You are a helpful customer service agent for ${project.name}. Use the knowledge base to answer customer questions accurately and helpfully. Be friendly, professional, and concise.`,
        model: 'gpt-5-mini-2025-08-07',
        tools: [{ type: 'file_search' }],
      }),
    });

    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      console.error('Assistant creation failed:', errorText);
      throw new Error(`Failed to create assistant: ${errorText}`);
    }

    const assistantData = await assistantResponse.json();
    const assistantId = assistantData.id;

    // Run the assistant
    console.log('Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Run creation failed:', errorText);
      throw new Error(`Failed to run assistant: ${errorText}`);
    }

    const runData = await runResponse.json();
    let runStatus = runData.status;

    // Poll for completion
    console.log('Waiting for completion...');
    let attempts = 0;
    const maxAttempts = 30;
    
    while (runStatus !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runData.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      
      if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run ${runStatus}: ${statusData.last_error?.message || 'Unknown error'}`);
      }
      
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error('Assistant run timed out');
    }

    // Get messages
    console.log('Fetching response...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesResponse.ok) {
      throw new Error('Failed to fetch messages');
    }

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    const responseText = assistantMessage.content[0]?.text?.value || 'No response';

    return new Response(
      JSON.stringify({
        response: responseText,
        threadId: currentThreadId,
        sessionId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-customer-service function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
