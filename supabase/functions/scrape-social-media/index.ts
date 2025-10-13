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
    const { projectId, platform, url } = await req.json();

    if (!projectId || !platform || !url) {
      throw new Error('projectId, platform, and url are required');
    }

    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine which Apify actor to use
    let actorId: string;
    let inputConfig: any;

    if (platform === 'instagram') {
      // Determine if it's a post or profile URL
      const isPost = url.includes('/p/') || url.includes('/reel/');
      
      if (isPost) {
        actorId = 'apify/instagram-post-scraper';
        inputConfig = {
          directUrls: [url],
          resultsLimit: 1,
        };
      } else {
        actorId = 'apify/instagram-scraper';
        inputConfig = {
          usernames: [url.split('/').filter(Boolean).pop()],
          resultsLimit: 10,
        };
      }
    } else if (platform === 'youtube') {
      actorId = 'streamers/youtube-scraper';
      inputConfig = {
        startUrls: [{ url }],
        maxResults: 10,
      };
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    console.log(`Running Apify actor ${actorId} for ${platform}`);

    // Run the Apify actor
    const actorResponse = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputConfig),
      }
    );

    if (!actorResponse.ok) {
      const errorText = await actorResponse.text();
      console.error('Apify actor run failed:', errorText);
      throw new Error(`Failed to run Apify actor: ${errorText}`);
    }

    const runData = await actorResponse.json();
    const runId = runData.data.id;
    console.log(`Actor run started: ${runId}`);

    // Poll for completion
    let runStatus = runData.data.status;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (runStatus !== 'SUCCEEDED' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${APIFY_API_KEY}`
      );

      if (!statusResponse.ok) {
        throw new Error('Failed to check run status');
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.data.status;

      if (runStatus === 'FAILED' || runStatus === 'ABORTED' || runStatus === 'TIMED-OUT') {
        throw new Error(`Scraper run ${runStatus}`);
      }

      attempts++;
    }

    if (runStatus !== 'SUCCEEDED') {
      throw new Error('Scraper run timed out');
    }

    // Get the results
    console.log('Fetching scraper results...');
    const resultsResponse = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
    );

    if (!resultsResponse.ok) {
      throw new Error('Failed to fetch scraper results');
    }

    const results = await resultsResponse.json();
    console.log(`Scraped ${results.length} items`);

    // Save results to database
    const savedItems = [];
    for (const item of results) {
      const { data: savedItem, error } = await supabase
        .from('social_media_content')
        .insert({
          project_id: projectId,
          platform,
          content_url: item.url || url,
          content_type: item.type || (platform === 'youtube' ? 'video' : 'post'),
          scrape_data: item,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save item:', error);
      } else {
        savedItems.push(savedItem);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        itemsScraped: results.length,
        itemsSaved: savedItems.length,
        runId,
        data: savedItems,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in scrape-social-media function:', error);
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
