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
    const { prompt, existingCode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = existingCode 
      ? `You are a web development expert. The user wants to modify their existing website. Generate ONLY the updated HTML, CSS, and JavaScript code. Return a JSON object with three fields: "html", "css", and "js". Each field should contain the complete updated code. Make sure all buttons, links, forms, and navigation elements are fully functional with proper event handlers and logic. No placeholder buttons or incomplete functionality.

Current code:
HTML: ${existingCode.html}
CSS: ${existingCode.css}
JS: ${existingCode.js}

User's modification request: ${prompt}`
      : `You are a web development expert. Generate a complete, fully functional website based on the user's description. Return a JSON object with three fields: "html", "css", and "js". 

CRITICAL REQUIREMENTS:
- ALL buttons must have working onclick handlers
- ALL forms must have working submit handlers and validation
- ALL navigation links must work properly
- ALL interactive elements must be fully functional
- Include proper event listeners in the JavaScript
- Make it responsive and modern
- Use clean, semantic HTML
- No placeholder or dummy buttons
- Every interactive element must DO something

User's description: ${prompt}`;

    console.log('Calling Lovable AI...');
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
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI Response received');
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify({
        html: parsedContent.html || '',
        css: parsedContent.css || '',
        js: parsedContent.js || ''
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-website function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
