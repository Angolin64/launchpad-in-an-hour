import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get project data and verify ownership
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;
    
    if (project.user_id !== user.id) {
      throw new Error('Forbidden: You do not own this project');
    }

    // Use service role key for subsequent operations
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get generation statuses
    const { data: statuses, error: statusError } = await supabaseServiceClient
      .from('generation_status')
      .select('*')
      .eq('project_id', projectId);

    if (statusError) throw statusError;

    console.log(`Starting content generation for project: ${project.name}`);

    // Update project status to processing
    await supabaseServiceClient
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId);

    // Generate content for each channel
    const formData = project.form_data;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    for (const status of statuses) {
      const contentType = status.content_type;
      
      try {
        // Update status to processing
        await supabaseServiceClient
          .from('generation_status')
          .update({ 
            status: 'processing', 
            progress: 10,
            estimated_time_remaining: 120 
          })
          .eq('id', status.id);

        let generatedContent;
        let systemPrompt = '';
        let userPrompt = '';

        // Create prompts based on content type
        if (contentType === 'youtube') {
          systemPrompt = 'You are an expert YouTube content creator specializing in creating viral Shorts scripts. Create engaging, hook-driven scripts that capture attention in the first 3 seconds.';
          userPrompt = `Create 5 YouTube Shorts scripts for the following product:
          
Product Name: ${formData.product.name}
Description: ${formData.product.description}
Price: ${formData.product.price}
Key Features: ${formData.product.features.join(', ')}
Differentiators: ${formData.product.differentiators}

Target Audience:
- Niche: ${formData.audience.niche}
- Pain Points: ${formData.audience.painPoints.join(', ')}
- Goals: ${formData.audience.goals.join(', ')}
- Language: ${formData.audience.language}

Brand Voice: ${formData.brand.tone}

For each script, provide:
1. A powerful hook (first 3 seconds)
2. Main value/benefit (15-20 seconds)
3. Clear CTA (5 seconds)

Format as JSON array with: { title, hook, body, cta }`;

        } else if (contentType === 'instagram') {
          systemPrompt = 'You are a social media expert specializing in Instagram carousel content. Create educational, visually-driven carousel posts that provide value and drive engagement.';
          userPrompt = `Create 3 Instagram carousel post scripts (8-10 slides each) for:
          
Product: ${formData.product.name}
Description: ${formData.product.description}
Features: ${formData.product.features.join(', ')}

Target Audience: ${formData.audience.niche}
Pain Points: ${formData.audience.painPoints.join(', ')}

Brand Tone: ${formData.brand.tone}

For each carousel, provide:
1. Cover slide (hook + title)
2. 6-8 content slides (one key point per slide)
3. CTA slide

Format as JSON array with: { title, slides: [{ slideNumber, heading, content }] }`;

        } else if (contentType === 'email') {
          systemPrompt = 'You are an email marketing expert. Create compelling email sequences that nurture leads and drive conversions with personalized, value-driven messaging.';
          userPrompt = `Create a 5-email nurture sequence for:

Product: ${formData.product.name}
Description: ${formData.product.description}
Price: ${formData.product.price}

Audience: ${formData.audience.niche}
Pain Points: ${formData.audience.painPoints.join(', ')}
Goals: ${formData.audience.goals.join(', ')}
Objections: ${formData.audience.objections.join(', ')}

Brand Voice: ${formData.brand.tone}

Create:
Email 1: Welcome + Problem awareness
Email 2: Solution introduction
Email 3: Social proof + benefits
Email 4: Address objections
Email 5: Strong CTA + urgency

Format as JSON array with: { emailNumber, subject, preview, body, cta }`;

        } else if (contentType === 'faq') {
          systemPrompt = 'You are a customer support expert. Create comprehensive, clear FAQ sections that anticipate and answer customer questions effectively.';
          userPrompt = `Create 20+ FAQ entries for:

Product: ${formData.product.name}
Description: ${formData.product.description}
Price: ${formData.product.price}
Features: ${formData.product.features.join(', ')}

Support Info:
${formData.support.policies}
Pricing Details: ${formData.support.pricingDetails}
Onboarding: ${formData.support.onboardingSteps.join(', ')}

Common Objections: ${formData.audience.objections.join(', ')}

Organize into sections:
- Product & Features (8-10 questions)
- Pricing & Payment (5-7 questions)
- Getting Started (4-6 questions)
- Technical Support (3-5 questions)

Format as JSON with: { sections: [{ category, questions: [{ question, answer }] }] }`;

        } else if (contentType === 'chatbot') {
          systemPrompt = 'You are an AI training specialist. Create a comprehensive knowledge base for an AI support chatbot that can handle customer inquiries naturally and helpfully.';
          userPrompt = `Create a chatbot knowledge base for:

Product: ${formData.product.name}
Description: ${formData.product.description}
Features: ${formData.product.features.join(', ')}

Support Data:
${formData.support.policies}
Pricing: ${formData.support.pricingDetails}
Onboarding: ${formData.support.onboardingSteps.join(', ')}
Tutorials: ${formData.support.tutorialLinks.join(', ')}

Brand Voice: ${formData.brand.tone}

Create a knowledge base with:
1. Product information
2. Common queries and responses
3. Troubleshooting guides
4. Escalation triggers (when to involve human support)

Format as JSON with: { productInfo, commonQueries: [{ query, response, tags }], troubleshooting: [{ issue, solution }], escalationTriggers: [] }`;
        }

        // Call Lovable AI
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
          }),
        });

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (response.status === 402) {
          throw new Error('AI usage limit reached. Please add credits to continue.');
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`AI API error: ${errorText}`);
        }

        const aiData = await response.json();
        const content = aiData.choices[0].message.content;

        // Try to parse JSON from the response
        let parsedContent;
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[1]);
          } else {
            parsedContent = JSON.parse(content);
          }
        } catch {
          // If parsing fails, use the content as-is
          parsedContent = { content };
        }

        // Update progress to 50%
        await supabaseServiceClient
          .from('generation_status')
          .update({ progress: 50, estimated_time_remaining: 60 })
          .eq('id', status.id);

        // Save to deliverables
        await supabaseServiceClient
          .from('deliverables')
          .upsert({
            project_id: projectId,
            content_type: contentType,
            content: parsedContent,
          });

        // If chatbot content, auto-create chatbot_config with defaults from form data
        if (contentType === 'chatbot') {
          const { data: existingConfig } = await supabaseServiceClient
            .from('chatbot_config')
            .select('id')
            .eq('project_id', projectId)
            .maybeSingle();

          if (!existingConfig) {
            await supabaseServiceClient
              .from('chatbot_config')
              .insert({
                project_id: projectId,
                theme_color: formData.brand?.color || '#8B5CF6',
                bot_name: `${formData.product?.name || 'AI'} Assistant`,
                greeting_message: parsedContent.greeting || 'Hello! How can I help you today?',
                response_style: formData.brand?.tone?.toLowerCase() || 'friendly',
                ai_model: 'google/gemini-2.5-flash',
                temperature: 0.7,
                max_tokens: 500,
                conversation_memory_enabled: true,
              });
            console.log('✓ Created default chatbot configuration');
          }
        }

        // Mark as complete
        await supabaseServiceClient
          .from('generation_status')
          .update({ 
            status: 'complete', 
            progress: 100,
            estimated_time_remaining: 0
          })
          .eq('id', status.id);

        console.log(`✓ Generated ${contentType} content`);

      } catch (error) {
        console.error(`Error generating ${contentType}:`, error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Mark as error
        await supabaseServiceClient
          .from('generation_status')
          .update({ 
            status: 'error', 
            error_message: errorMessage
          })
          .eq('id', status.id);
      }
    }

    // Update project status to complete
    await supabaseServiceClient
      .from('projects')
      .update({ status: 'complete' })
      .eq('id', projectId);

    console.log(`✓ Content generation complete for project: ${project.name}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Content generation complete' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
