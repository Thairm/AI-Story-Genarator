
export interface Narrator {
  id: string;
  name: string;
  style: string;
  gender: 'male' | 'female';
  previewUrl?: string;
}

// ElevenLabs Flash v2.5 Voice Settings
export interface VoiceSettings {
  stability: number;        // 0-1, default 0.5 - Lower = expressive, Higher = consistent
  similarityBoost: number;  // 0-1, default 0.75 - How closely to match original voice
  speed: number;            // 0.7-1.2, default 1.0 - Speech pace
  style: number;            // 0-1, default 0 - Style exaggeration
  useSpeakerBoost: boolean; // default false - Improves number/unit reading
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarityBoost: 0.75,
  speed: 1.0,
  style: 0,
  useSpeakerBoost: false
};

// Background Video Types
export type BackgroundType = 'long_gameplay' | 'medium_gameplay' | 'asmr_clips';

export interface BackgroundVideo {
  id: string;
  url: string;        // Full video URL in R2
  duration?: number;  // Duration in seconds (for random start calculation)
}

export interface BackgroundOption {
  id: string;
  name: string;
  type: BackgroundType;
  previewUrl: string;  // Short looping preview video (5-10 seconds)
  videos: BackgroundVideo[];  // Full videos for rendering
}

// New Types for Split System
export type AnimationType = 'popup' | 'karaoke' | 'typewriter' | 'static';

export interface CaptionAnimation {
  id: AnimationType;
  name: string;
  description: string;
}

export interface CaptionFont {
  id: string;
  name: string;
  family: string; // The CSS/ASS font family name
  url: string; // URL to the .ttf file
}

export interface CaptionTheme {
  id: string;
  name: string;
  primaryColor: string; // Hex for UI
  secondaryColor: string; // Hex for UI (Border/Shadow)
  isNeon?: boolean; // Special flag for glow effect
  // Font family removed, now handled by CaptionFont
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface ImageStyle {
  id: string;
  name: string;
  promptModifier: string;
  previewUrl: string; // Local asset or remote URL
}

export interface ScriptSentence {
  id: string;
  text: string;
  isLocked: boolean;
  audioUrl?: string; // Blob URL of the generated audio
  duration?: number; // Duration in seconds
  wordTimestamps?: WordTimestamp[]; // Word-level timing relative to the start of this sentence
  // New fields for Image Stories
  imageUrl?: string;
  imagePrompt?: string;
}

export interface ScriptSection {
  id: string;
  title: string;
  sentences: ScriptSentence[];
}

export interface VideoConfig {
  prompt: string;
  script: ScriptSection[];
  narratorId: string;
  // New Split Configuration
  captionAnimationId: AnimationType;
  captionThemeId: string;
  captionFontId: string;
  captionY: number; // Vertical position percentage (0-100)
  captionX: number; // Horizontal position percentage (0-100)
  captionScale: number; // Font scale multiplier (default 1.0)
  backgroundId: string;
  // For Image Stories
  imageStyleId?: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// User plan type for tiered storage
export type UserPlan = 'free' | 'pro';

// User context (for storage provider selection)
export interface UserContext {
  plan: UserPlan;
  userId?: string; // For cloud storage when auth is added
}

// Saved video project for My Videos tab
export interface SavedVideoProject {
  id: string;                    // Unique ID (UUID)
  title: string;                 // Auto-generated or user-defined title
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  config: VideoConfig;           // Full config snapshot
  thumbnailDataUrl?: string;     // Base64 data URL of first frame
  storageType: 'local' | 'cloud'; // Where this project is stored
}

// Default system prompt for AI story generation (user-editable part)
export const DEFAULT_SYSTEM_PROMPT = `You are an expert viral scriptwriter for TikTok and YouTube Shorts, specializing in "Reddit Story" style content.

Your goal is to take a rough idea and turn it into a hook-filled, engaging FIRST-PERSON story suitable for video narration.

RULES:
1. **Perspective**: Write in First Person ("I", "Me", "My").
2. **Length**: Between 300 and 600 words.
3. **Tone**: Conversational, slightly dramatic, engaging.
4. **Sections**: Split into multiple distinct sections.`;

// Default system prompt for Horror Story generation
export const DEFAULT_HORROR_SYSTEM_PROMPT = `You are an expert horror scriptwriter for TikTok and YouTube Shorts, specializing in short-form scary stories.

Your goal is to take a horror concept and turn it into a chilling, atmospheric THIRD-PERSON narrative suitable for video narration with AI-generated visuals.

RULES:
1. **Perspective**: Write in Third Person ("They", "She", "He", "The protagonist").
2. **Length**: Between 150 and 250 words (for 1-1.5 minute narration).
3. **Tone**: Dark, atmospheric, suspenseful, with vivid visual imagery.
4. **Structure**: 
   - Hook the viewer immediately with an unsettling scene
   - Build tension gradually
   - End with a disturbing twist or lingering dread
5. **Visual Focus**: Each sentence should paint a clear, cinematic image suitable for AI generation.
6. **Sections**: Split into 3-5 distinct scenes/moments.`;
