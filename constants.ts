
import { BackgroundOption, Narrator, CaptionAnimation, CaptionTheme, CaptionFont } from "./types";

export const NARRATORS: Narrator[] = [
  // Male Voices
  { id: 'adam', name: 'Adam', style: 'Deep, Authoritative', gender: 'male' },
  { id: 'josh', name: 'Josh', style: 'Deep, Narrator', gender: 'male' },
  { id: 'clyde', name: 'Clyde', style: 'War Veteran, Intense', gender: 'male' },
  { id: 'charlie', name: 'Charlie', style: 'Casual, Natural', gender: 'male' },
  { id: 'james', name: 'James', style: 'Deep, Australian', gender: 'male' },
  { id: 'sam', name: 'Sam', style: 'Raspy, Dynamic', gender: 'male' },
  // Female Voices
  { id: 'rachel', name: 'Rachel', style: 'Calm, Professional', gender: 'female' },
  { id: 'freya', name: 'Freya', style: 'Dramatic, Expressive', gender: 'female' },
  { id: 'emily', name: 'Emily', style: 'Calm, Soothing', gender: 'female' },
  { id: 'matilda', name: 'Matilda', style: 'Warm, Friendly', gender: 'female' },
  { id: 'jessie', name: 'Jessie', style: 'Raspy, Intense', gender: 'female' },
  { id: 'dorothy', name: 'Dorothy', style: 'Pleasant, British', gender: 'female' },
];

export const CAPTION_ANIMATIONS: CaptionAnimation[] = [
  { id: 'popup', name: 'Pop-Up', description: 'Fast-paced, one word at a time.' },
  { id: 'karaoke', name: 'Karaoke', description: 'Highlight current word in sentence.' },
  { id: 'typewriter', name: 'Typewriter', description: 'Characters appear one by one.' },
  { id: 'static', name: 'Static', description: 'Clean full text. No motion.' },
];

export const CAPTION_FONTS: CaptionFont[] = [
  {
    id: 'bold',
    name: 'Bold Sans',
    family: 'Inter',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Black.ttf'
  },
  {
    id: 'comic',
    name: 'Comic',
    family: 'Bangers',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/Bangers-Regular.ttf'
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    family: 'RobotoMono',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/robotomono/RobotoMono-Bold.ttf'
  },
];

export const CAPTION_THEMES: CaptionTheme[] = [
  { id: 'hormozi', name: 'Bold Gold', primaryColor: '#FFD700', secondaryColor: '#000000' },
  { id: 'super_red', name: 'Super Red', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  { id: 'neon_blue', name: 'Neon Blue', primaryColor: '#FFFFFF', secondaryColor: '#00FFFF', isNeon: true },
  { id: 'matrix', name: 'Matrix', primaryColor: '#00FF00', secondaryColor: '#000000' },
  { id: 'royal', name: 'Royal Purple', primaryColor: '#D8BFD8', secondaryColor: '#4B0082' },
  { id: 'clean', name: 'Clean White', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
];

// R2 Storage Base URL
const R2_BASE_URL = 'https://pub-404883f327e545929c96e214f0c46f31.r2.dev';

export const BACKGROUNDS: BackgroundOption[] = [
  // Long Gameplay (2+ hours) - Random video + random start point
  {
    id: 'minecraft',
    name: 'Minecraft Parkour',
    type: 'long_gameplay',
    previewUrl: `${R2_BASE_URL}/minecraft/Minecraft%20video%20preview.mp4`,
    videos: [
      // Add full videos here as you upload them
      // { id: 'mc1', url: `${R2_BASE_URL}/minecraft/full_1.mp4`, duration: 7200 },
    ]
  },
  {
    id: 'gta',
    name: 'GTA V Ramps',
    type: 'long_gameplay',
    previewUrl: `${R2_BASE_URL}/gta/preview.mp4`,  // Upload this later
    videos: []
  },
  // Medium Gameplay (~5 minutes) - Random video, trim from start
  {
    id: 'subway',
    name: 'Subway Surfers',
    type: 'medium_gameplay',
    previewUrl: `${R2_BASE_URL}/subway/preview.mp4`,  // Upload this later
    videos: []
  },
  {
    id: 'temple',
    name: 'Temple Run',
    type: 'medium_gameplay',
    previewUrl: `${R2_BASE_URL}/temple/preview.mp4`,  // Upload this later
    videos: []
  },
  // ASMR Clips (3-15 seconds each) - Randomly combine multiple
  {
    id: 'slime',
    name: 'Satisfying Slime',
    type: 'asmr_clips',
    previewUrl: `${R2_BASE_URL}/slime/preview.mp4`,  // Upload this later
    videos: []
  },
  {
    id: 'soap',
    name: 'Soap Cutting',
    type: 'asmr_clips',
    previewUrl: `${R2_BASE_URL}/soap/preview.mp4`,  // Upload this later
    videos: []
  },
  {
    id: 'sand',
    name: 'Kinetic Sand',
    type: 'asmr_clips',
    previewUrl: `${R2_BASE_URL}/sand/preview.mp4`,  // Upload this later
    videos: []
  }
];
