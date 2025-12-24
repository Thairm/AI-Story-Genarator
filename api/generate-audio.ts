
// Vercel Serverless Function for ElevenLabs Text-to-Speech
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, voiceId, voiceSettings } = request.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Fallback Mock Mode if API Key is missing
    if (!apiKey) {
      console.warn("Missing ELEVENLABS_API_KEY, returning mock error");
      return response.status(503).json({ error: "Service Unavailable: Missing API Key" });
    }

    // Default voice settings (Flash v2.5 compatible)
    const settings = {
      stability: voiceSettings?.stability ?? 0.5,
      similarity_boost: voiceSettings?.similarityBoost ?? 0.75,
      style: voiceSettings?.style ?? 0,
      use_speaker_boost: voiceSettings?.useSpeakerBoost ?? false,
      speed: voiceSettings?.speed ?? 1.0
    };

    // ElevenLabs API Endpoint with timestamps
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;

    const ttsResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_flash_v2_5",
        voice_settings: settings
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
