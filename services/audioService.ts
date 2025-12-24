
import { ScriptSentence, WordTimestamp, VoiceSettings, DEFAULT_VOICE_SETTINGS } from "../types";

// Map our internal IDs to ElevenLabs Voice IDs
const VOICE_MAP: Record<string, string> = {
  // Male Voices
  'adam': 'pNInz6obpgDQGcFmaJgB',
  'josh': 'TxGEqnHWrfWFTfGW9XjX',
  'clyde': '2EiwWnXFnvU5JabPnv8n',
  'charlie': 'IKne3meq5aSn9XLyUdCD',
  'james': 'ZQe5CZNOzWyzPSCn5a3c',
  'sam': 'yoZ06aMxZJJ28mfd3POQ',
  // Female Voices
  'rachel': '21m00Tcm4TlvDq8ikWAM',
  'freya': 'jsCqWAovK2LkecY7zXl4',
  'emily': 'LcfcDJNUP1GQjkzn1xUU',
  'matilda': 'XrExE9yKIg1WjnnlVkGX',
  'jessie': 't0jbNlBVZ17f02VDIeMI',
  'dorothy': 'ThT5KcBeYPX3keUQqHPh',
};

// Helper to get duration of audio blob
const getAudioDuration = (blob: Blob): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => resolve(0);
  });
};

// --- TIMESTAMP LOGIC ---

interface AlignmentData {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

// Convert ElevenLabs character alignment to Word Timestamps
const parseAlignment = (alignment: AlignmentData): WordTimestamp[] => {
  const words: WordTimestamp[] = [];
  let currentWord = "";
  let wordStart = -1;
  let wordEnd = 0;

  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i];
    const start = alignment.character_start_times_seconds[i];
    const end = alignment.character_end_times_seconds[i];

    // If it's a space or special separator, finish the current word
    if (char === " " || char === "\n") {
      if (currentWord) {
        words.push({
          word: currentWord,
          start: wordStart,
          end: wordEnd
        });
        currentWord = "";
        wordStart = -1;
      }
      continue;
    }

    // Start of a new word
    if (wordStart === -1) {
      wordStart = start;
    }

    // Accumulate word
    currentWord += char;
    wordEnd = end;
  }

  // Push last word if exists
  if (currentWord) {
    words.push({
      word: currentWord,
      start: wordStart,
      end: wordEnd
    });
  }

  return words;
};

// Fallback: Smart Aligner (Estimated)
const estimateWordTimestamps = (text: string, duration: number): WordTimestamp[] => {
  const words = text.split(/\s+/);
  const totalWords = words.length;
  if (totalWords === 0) return [];

  const timePerChar = duration / text.length;

  let currentTime = 0;
  return words.map(word => {
    const wordDuration = (word.length + 1) * timePerChar;
    const start = currentTime;
    const end = currentTime + wordDuration;
    currentTime = end;

    return {
      word,
      start,
      end
    };
  });
};

// Base64 to Blob helper
const base64ToBlob = (base64: string, type: string = 'audio/mpeg'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
};

export const generateSpeech = async (
  sentence: ScriptSentence,
  narratorId: string,
  voiceSettings: VoiceSettings = DEFAULT_VOICE_SETTINGS
): Promise<ScriptSentence> => {
  try {
    const voiceId = VOICE_MAP[narratorId] || VOICE_MAP['adam'];

    // 1. Call Backend
    const response = await fetch('/api/generate-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: sentence.text,
        voiceId: voiceId,
        voiceSettings: voiceSettings
      })
    });

    if (!response.ok) {
      // Mock Fallback (503 usually means missing key)
      if (response.status === 503) {
        console.warn("Using Mock Audio (Missing API Key)");
        return generateMockAudio(sentence);
      }
      throw new Error('Failed to generate audio');
    }

    // 2. Parse New JSON Format
    const data = await response.json();

    // Check if we got the new format (with alignment) or legacy/fallback
    let audioUrl: string;
    let duration: number;
    let wordTimestamps: WordTimestamp[];

    if (data.audio_base64) {
      // --- REAL TIMESTAMPS PATH (API Key Present) ---
      const blob = base64ToBlob(data.audio_base64);
      audioUrl = URL.createObjectURL(blob);
      duration = await getAudioDuration(blob);

      // Use real alignment if available
      if (data.alignment) {
        wordTimestamps = parseAlignment(data.alignment);
      } else {
        console.warn("No alignment data returned, using estimation.");
        wordTimestamps = estimateWordTimestamps(sentence.text, duration);
      }

    } else {
      // --- LEGACY/BINARY PATH (Should not happen with new backend, but safe to keep) ---
      // If the backend returned a raw blob directly (unlikely with new code)
      console.warn("Received raw blob/legacy format unexpectedly.");
      // This part is tricky because response.json() already consumed the stream. 
      // In a robust app we'd check Content-Type first. 
      // For now, assume if audio_base64 is missing, something failed politely.
      throw new Error("Invalid response format");
    }

    return {
      ...sentence,
      audioUrl,
      duration,
      wordTimestamps
    };

  } catch (error) {
    console.error("Audio Service Error:", error);
    return generateMockAudio(sentence);
  }
};

// Mock Audio Generator (Offline/No-Key Mode)
const generateMockAudio = async (sentence: ScriptSentence): Promise<ScriptSentence> => {
  const silentMp3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTS1UAAAAOAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAAAAAAAAAAAAACCAAAAAAAAAAAAAA//OUAAAAAAAAAAAAAAAAAAAAAAA=";

  const res = await fetch(silentMp3);
  const blob = await res.blob();
  const duration = Math.max(1, sentence.text.split(' ').length * 0.4);

  return {
    ...sentence,
    audioUrl: URL.createObjectURL(blob),
    duration,
    wordTimestamps: estimateWordTimestamps(sentence.text, duration)
  };
};
