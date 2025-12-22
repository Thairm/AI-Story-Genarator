
export interface Narrator {
  id: string;
  name: string;
  style: string;
  previewUrl?: string;
}

export interface BackgroundOption {
  id: string;
  name: string;
  thumbnail: string;
  videoUrl?: string; // Optional: URL for the video preview
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

export interface ScriptSentence {
  id: string;
  text: string;
  isLocked: boolean;
  audioUrl?: string; // Blob URL of the generated audio
  duration?: number; // Duration in seconds
  wordTimestamps?: WordTimestamp[]; // Word-level timing relative to the start of this sentence
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
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
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
