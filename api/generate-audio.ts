
// Vercel Serverless Function for ElevenLabs Text-to-Speech
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, voiceId } = request.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Fallback Mock Mode if API Key is missing
    if (!apiKey) {
      console.warn("Missing ELEVENLABS_API_KEY, returning mock error");
      return response.status(503).json({ error: "Service Unavailable: Missing API Key" });
    }

    // ElevenLabs API Endpoint
    // We use the REST API with the `with_timestamps` query param to get alignment data.
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;
    
    const ttsResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!ttsResponse.ok) {
      const err = await ttsResponse.json();
      throw new Error(err.detail?.message || 'ElevenLabs API Error');
    }

    const data = await ttsResponse.json();
    
    // The response is a JSON object with:
    // {
    //   "audio_base64": "...",
    //   "alignment": {
    //     "characters": [...],
    //     "character_start_times_seconds": [...],
    //     "character_end_times_seconds": [...]
    //   }
    // }

    return response.status(200).json(data);

  } catch (error) {
    console.error("Audio Generation Error:", error);
    return response.status(500).json({ error: error.message });
  }
}
