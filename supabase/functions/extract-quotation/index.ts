import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error("No image data provided");
    }

    // Validate base64 format
    if (!imageData.startsWith('data:')) {
      throw new Error("Invalid image format. Expected base64 data URL.");
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const mimeType = imageData.split(';')[0].split(':')[1];
    console.log('Extracting quotation data from document...', `Type: ${mimeType}, Size: ${imageData.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a quotation data extraction expert. Extract quotation information from this document. Return ONLY a valid JSON object with these exact fields:
{
  "QUOTATION NO": "quotation number",
  "QUOTATION DATE": "date in DD/MM/YYYY format",
  "CLIENT": "client name",
  "NEW/OLD": "NEW or OLD",
  "DESCRIPTION 1": "first description",
  "DESCRIPTION 2": "second description",
  "QTY": "quantity as number",
  "UNIT COST": "unit cost as number",
  "TOTAL AMOUNT": "total amount as number",
  "SALES  PERSON": "sales person name",
  "INVOICE NO": "invoice number or empty",
  "STATUS": "INVOICED, PENDING, or REGRET"
}

Rules:
- If field not found, use empty string ""
- Remove currency symbols from numbers
- Date format: DD/MM/YYYY
- Return ONLY valid JSON, no extra text`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to your workspace.");
      }
      
      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log('AI Response:', content);

    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    let jsonStr = content.trim();
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    console.log('Extracted JSON string:', jsonStr);
    const extractedData = JSON.parse(jsonStr);
    console.log('Parsed data:', extractedData);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error extracting quotation:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
