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
    const { prompt, existingCode, image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate AI images if it's a new website (not an edit)
    let generatedImages: Array<{ prompt: string; url: string }> = [];
    if (!existingCode) {
      console.log('Generating AI images for website...');
      try {
        const imagePrompts = [
          `Professional hero banner image for: ${prompt}`,
          `Modern, clean background pattern for: ${prompt}`,
          `Attractive product/service showcase image for: ${prompt}`
        ];

        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              { role: 'user', content: imagePrompts[0] }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            generatedImages.push({ prompt: imagePrompts[0], url: imageUrl });
            console.log('Generated hero image successfully');
          }
        }
      } catch (imageError) {
        console.error('Error generating images:', imageError);
        // Continue without images if generation fails
      }
    }

    let userPrompt = prompt;
    if (image) {
      userPrompt = `${prompt}\n\nReference image provided by user for design inspiration.`;
    }
    
    if (generatedImages.length > 0) {
      userPrompt = `${prompt}\n\nUse this generated hero image in the website: ${generatedImages[0].url}\nMake sure to use it as the main hero/banner image.`;
    }

    const systemPrompt = existingCode 
      ? `You are a web development expert. The user wants to modify their existing website. Generate ONLY the updated HTML, CSS, and JavaScript code. Return a JSON object with three fields: "html", "css", and "js". Each field should contain the complete updated code. Make sure all buttons, links, forms, and navigation elements are fully functional with proper event handlers and logic. No placeholder buttons or incomplete functionality.

Current code:
HTML: ${existingCode.html}
CSS: ${existingCode.css}
JS: ${existingCode.js}

User's modification request: ${userPrompt}`
      : `You are a web development expert. Generate a complete, fully functional website based on the user's description. Return a JSON object with three fields: "html", "css", and "js". 

CRITICAL REQUIREMENTS:
- ALL buttons must have working onclick handlers
- ALL forms must have working submit handlers and validation
- ALL navigation links must work properly
- ALL interactive elements must be fully functional
- Include proper event listeners in the JavaScript
- Make it responsive and modern with beautiful design
- Use clean, semantic HTML
- No placeholder or dummy buttons
- Every interactive element must DO something
- Use the provided AI-generated images when available
- Create professional, polished designs with proper spacing and colors

User's description: ${userPrompt}`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    if (image) {
      messages[1] = {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: image } }
        ]
      };
    }

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
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
