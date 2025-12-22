// Vercel Serverless Function Handler - OpenAI Script Generation
export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, customSystemPrompt } = request.body;

    // 1. Get the API Key securely from the server environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing in environment variables");
      return response.status(500).json({ error: "Server Configuration Error: Missing OpenAI API Key" });
    }

    // 2. Define the default user-editable instructions (used if no custom prompt provided)
    const defaultUserInstructions = `You are an expert viral scriptwriter for TikTok and YouTube Shorts, specializing in "Reddit Story" style content.

Your goal is to take a rough idea and turn it into a hook-filled, engaging FIRST-PERSON story suitable for video narration.

RULES:
1. **Perspective**: Write in First Person ("I", "Me", "My").
2. **Length**: Between 300 and 600 words.
3. **Tone**: Conversational, slightly dramatic, engaging.
4. **Sections**: Split into multiple distinct sections.`;

    // 3. Fixed JSON format instructions (always appended, not user-editable)
    const fixedJsonInstructions = `

REQUIRED OUTPUT FORMAT (DO NOT MODIFY):
Return ONLY a valid JSON object. The JSON structure must be:
{
  "script": [
    {
      "title": "Section Title",
      "sentences": ["Sentence 1", "Sentence 2"]
    }
  ]
}

Do not include any markdown formatting, code blocks, or extra text. Only return the raw JSON object.`;

    // 4. Combine user instructions with fixed format
    const userInstructions = customSystemPrompt || defaultUserInstructions;
    const systemInstruction = userInstructions + fixedJsonInstructions;

    // 5. Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemInstruction
          },
          {
            role: 'user',
            content: `Enhance this video idea into a compelling script: ${prompt}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);
      // Return the specific OpenAI error to the frontend
      return response.status(500).json({ error: `OpenAI Error: ${errorData.error?.message || 'Unknown OpenAI Error'}` });
    }

    const data = await openaiResponse.json();
    const content = data.choices?.[0]?.message?.content || '[]';

    // 4. Send the result back to the frontend
    return response.status(200).json({ text: content });

  } catch (error) {
    console.error("Backend Generator Error:", error);
    // Return the specific exception message
    return response.status(500).json({ error: `Server Error: ${error instanceof Error ? error.message : 'Unknown Error'}` });
  }
}