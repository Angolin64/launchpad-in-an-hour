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
    const { contentType, content, projectName } = await req.json();
    const canvaApiKey = Deno.env.get('CANVA_API_KEY');

    if (!canvaApiKey) {
      throw new Error('Canva API key not configured');
    }

    console.log('Creating Canva design for:', contentType, projectName);

    // Prepare design data based on content type
    let designTitle = `${projectName} - ${contentType}`;
    let designType = 'Presentation'; // Default to presentation for most content
    
    // Map content types to Canva design types
    if (contentType === 'instagram') {
      designType = 'Instagram Post';
    } else if (contentType === 'youtube') {
      designType = 'Video';
    } else if (contentType === 'email') {
      designType = 'Email Header';
    }

    // Create a design using Canva API
    const canvaResponse = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${canvaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design_type: designType,
        title: designTitle,
      }),
    });

    if (!canvaResponse.ok) {
      const errorText = await canvaResponse.text();
      console.error('Canva API error:', canvaResponse.status, errorText);
      throw new Error(`Canva API error: ${canvaResponse.status} - ${errorText}`);
    }

    const canvaData = await canvaResponse.json();
    console.log('Canva design created:', canvaData);

    // Get the edit URL for the design
    const designId = canvaData.design?.id;
    const editUrl = canvaData.urls?.edit_url || `https://www.canva.com/design/${designId}/edit`;

    return new Response(
      JSON.stringify({
        success: true,
        designId,
        editUrl,
        message: 'Design created successfully in Canva',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in canva-export function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
