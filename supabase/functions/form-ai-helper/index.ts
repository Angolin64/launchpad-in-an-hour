import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldType, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompts: Record<string, string> = {
      productName: "Generate a creative and memorable product name. Be concise and catchy.",
      productDescription: "Generate a compelling product description that explains what the product does and who it's for. Be clear and persuasive. 2-3 sentences.",
      productPrice: "Suggest a pricing strategy (e.g., '$49/month' or '$199 one-time'). Consider the product context.",
      productFeatures: "List 3-5 key product features. Each should be a concise, benefit-focused statement.",
      productDifferentiators: "Explain what makes this product unique compared to competitors. Be specific. 2-3 sentences.",
      brandTone: "Suggest an appropriate brand tone (professional, casual, friendly, authoritative, or playful) based on the product.",
      brandColors: "Suggest a modern, attractive color palette (provide hex colors for primary, secondary, and accent).",
      brandFonts: "Suggest professional font combinations suitable for the product.",
      audienceDescription: "Describe the target audience in detail. Include demographics, needs, and pain points. 2-3 sentences.",
      channels: "Suggest the best marketing channels for this product and audience.",
      supportGreeting: "Create a friendly, professional greeting message for customer support.",
      faqQuestions: "Generate 5 common questions customers might ask about this product.",
    };

    const systemPrompt = prompts[fieldType] || "Provide helpful suggestions based on the context.";
    const userPrompt = context ? `Context: ${context}\n\n${systemPrompt}` : systemPrompt;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a helpful marketing and product assistant. Provide concise, practical suggestions.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ suggestion }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in form-ai-helper function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
