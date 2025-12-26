
import { BackgroundOption, Narrator, CaptionAnimation, CaptionTheme, CaptionFont } from "./types";

export const NARRATORS: Narrator[] = [
  // Male Voices
  { id: 'adam', name: 'Adam', style: 'Deep, Authoritative', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3' },
  { id: 'josh', name: 'Josh', style: 'Deep, Narrator', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3' },
  { id: 'clyde', name: 'Clyde', style: 'War Veteran, Intense', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3' },
  { id: 'charlie', name: 'Charlie', style: 'Casual, Natural', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3' },
  { id: 'james', name: 'James', style: 'Deep, Australian', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3' },
  { id: 'sam', name: 'Sam', style: 'Raspy, Dynamic', gender: 'male', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3' },
  // Female Voices
  { id: 'rachel', name: 'Rachel', style: 'Calm, Professional', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3' },
  { id: 'freya', name: 'Freya', style: 'Dramatic, Expressive', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3' },
  { id: 'emily', name: 'Emily', style: 'Calm, Soothing', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3' },
  { id: 'matilda', name: 'Matilda', style: 'Warm, Friendly', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3' },
  { id: 'jessie', name: 'Jessie', style: 'Raspy, Intense', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3' },
  { id: 'dorothy', name: 'Dorothy', style: 'Pleasant, British', gender: 'female', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3' },
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
      // 12 Chunks of Parkour Gameplay
      { id: 'mc_parkour_1', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_1.mp4`, duration: 300 },
      { id: 'mc_parkour_2', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_2.mp4`, duration: 300 },
      { id: 'mc_parkour_3', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_3.mp4`, duration: 300 },
      { id: 'mc_parkour_4', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_4.mp4`, duration: 300 },
      { id: 'mc_parkour_5', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_5.mp4`, duration: 300 },
      { id: 'mc_parkour_6', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_6.mp4`, duration: 300 },
      { id: 'mc_parkour_7', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_7.mp4`, duration: 300 },
      { id: 'mc_parkour_8', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_8.mp4`, duration: 300 },
      { id: 'mc_parkour_9', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_9.mp4`, duration: 300 },
      { id: 'mc_parkour_10', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_10.mp4`, duration: 300 },
      { id: 'mc_parkour_11', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_11.mp4`, duration: 300 },
      { id: 'mc_parkour_12', url: `${R2_BASE_URL}/minecraft/videoforgeneration/chunk_12.mp4`, duration: 300 },
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
