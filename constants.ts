
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

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'minecraft',
    name: 'Minecraft Parkour',
    thumbnail: 'https://picsum.photos/seed/minecraft_parkour/300/533',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'gta',
    name: 'GTA V Ramps',
    thumbnail: 'https://picsum.photos/seed/gta_ramps/300/533'
  },
  {
    id: 'subway',
    name: 'Subway Surfers',
    thumbnail: 'https://picsum.photos/seed/subway_surfers/300/533'
  },
  {
    id: 'satisfying',
    name: 'Satisfying Slime',
    thumbnail: 'https://picsum.photos/seed/slime/300/533'
  },
  {
    id: 'hydraulic',
    name: 'Hydraulic Press',
    thumbnail: 'https://picsum.photos/seed/hydraulic/300/533'
  },
  {
    id: 'soap',
    name: 'Soap Cutting',
    thumbnail: 'https://picsum.photos/seed/soap/300/533'
  },
  {
    id: 'wood',
    name: 'Wood Turning',
    thumbnail: 'https://picsum.photos/seed/wood/300/533'
  }
];
