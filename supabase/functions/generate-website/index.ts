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
      ? `You are a web development expert. The user wants to modify their existing website. Generate ONLY the updated HTML, CSS, and JavaScript code. Return a JSON object with four fields: "html", "css", "js", and "imagePrompts". 

The imagePrompts field should be an array of descriptive prompts for AI-generated images that would enhance the website (for products, hero sections, backgrounds, etc.). Each prompt should be detailed and specify the style.

Current code:
HTML: ${existingCode.html}
CSS: ${existingCode.css}
JS: ${existingCode.js}

User's modification request: ${prompt}`
      : `You are a web development expert. Generate a complete, fully functional website based on the user's description. Return a JSON object with four fields: "html", "css", "js", and "imagePrompts". 

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
- In the HTML, use placeholder image tags like <img data-ai-image="0" alt="description"/> where images should be inserted
- The imagePrompts field should be an array of 3-5 detailed prompts for AI-generated images that would make the website look professional and alive
- Images should be for: hero sections, product displays, backgrounds, feature illustrations, etc.
- Each image prompt should be detailed and specify style (e.g., "modern product photo", "abstract background", "professional illustration")

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

    let html = parsedContent.html || '';
    
    // Generate images if prompts are provided
    if (parsedContent.imagePrompts && parsedContent.imagePrompts.length > 0) {
      console.log('Generating images...', parsedContent.imagePrompts);
      
      for (let i = 0; i < parsedContent.imagePrompts.length; i++) {
        const imagePrompt = parsedContent.imagePrompts[i];
        
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              { role: 'user', content: imagePrompt }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          
          if (imageUrl) {
            // Replace placeholder with actual image
            html = html.replace(
              new RegExp(`<img[^>]*data-ai-image="${i}"[^>]*>`, 'g'),
              `<img src="${imageUrl}" alt="${imagePrompt}" style="width: 100%; height: auto; object-fit: cover;">`
            );
            console.log(`Image ${i} generated and inserted`);
          }
        } else {
          console.error(`Failed to generate image ${i}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        html,
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
