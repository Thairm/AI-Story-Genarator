
import { ScriptSection, ScriptSentence, AnimationType } from "../types";
import { CAPTION_THEMES, CAPTION_FONTS } from "../constants";

// Helper: Convert Web Hex (#RRGGBB) to ASS BGR (&HBBGGRR&)
const toASSColor = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return '&HFFFFFF&';
  const r = cleanHex.substring(0, 2);
  const g = cleanHex.substring(2, 4);
  const b = cleanHex.substring(4, 6);
  return `&H${b}${g}${r}&`;
};

// Helper: Convert seconds to ASS timestamp (H:MM:SS.cc)
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds * 100) % 100);
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const generateASS = (
  script: ScriptSection[], 
  animationId: AnimationType, 
  themeId: string,
  fontId: string,
  captionY: number,
  captionX: number,
  captionScale: number
): string => {
  
  // 1. Get Theme & Font Configuration
  const theme = CAPTION_THEMES.find(t => t.id === themeId) || CAPTION_THEMES[0];
  const font = CAPTION_FONTS.find(f => f.id === fontId) || CAPTION_FONTS[0];

  const primaryColor = toASSColor(theme.primaryColor);
  const secondaryColor = toASSColor(theme.secondaryColor);
  
  // Map internal font family ID to ASS font name
  let fontName = 'Inter';
  if (font.family === 'Bangers') fontName = 'Bangers';
  if (font.family === 'RobotoMono') fontName = 'Roboto Mono';

  // Base font size
  const baseFontSize = font.family === 'Bangers' ? 110 : (font.family === 'RobotoMono' ? 60 : 90);
  // Apply User Scale
  const fontSize = Math.round(baseFontSize * captionScale);
  
  // Neon settings
  const outline = theme.isNeon ? 3 : 3;
  const shadow = theme.isNeon ? 0 : 0;
  const blur = theme.isNeon ? 5 : 0; 

  // --- POSITION CALCULATION ---
  // Video Resolution: 1080x1920
  // Convert percentage (0-100) to pixels
  // Alignment 5 (Middle Center) means (x,y) is the exact center of the text
  const posX = Math.round(1080 * (captionX / 100));
  const posY = Math.round(1920 * (captionY / 100));
  
  // We use the \pos(x,y) tag override for every line to ensure exact placement
  const posTag = `\\pos(${posX},${posY})`;

  // 2. Generate ASS Header dynamically
  // Alignment: 5 (Middle Center) is crucial for \pos to work as the center point
  const ASS_HEADER = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: CustomStyle,${fontName},${fontSize},${primaryColor},${secondaryColor},${secondaryColor},&H80000000,-1,0,0,0,100,100,0,0,1,${outline},${shadow},5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  let events = "";
  let globalOffset = 0;
  
  const allSentences = script.flatMap(s => s.sentences);

  allSentences.forEach((sentence: ScriptSentence) => {
    // Default duration calculation if missing
    const duration = sentence.duration || (sentence.text.split(/\s+/).length * 0.4);
    
    // Fallback timestamps
    let timestamps = sentence.wordTimestamps;
    if (!timestamps || timestamps.length === 0) {
        const words = sentence.text.split(/\s+/);
        const durPerWord = duration / words.length;
        timestamps = words.map((w, i) => ({
            word: w,
            start: i * durPerWord,
            end: (i + 1) * durPerWord
        }));
    }

    // --- ANIMATION LOGIC ---

    // A. POP-UP (One word at a time)
    if (animationId === 'popup') {
        timestamps.forEach((wt) => {
            const absStart = globalOffset + wt.start;
            const absEnd = globalOffset + wt.end;
            
            const isImpact = wt.word.length > 5;
            const scaleTag = isImpact ? '\\fscx115\\fscy115' : '';
            const blurTag = blur > 0 ? `\\blur${blur}` : '';
            const rotateTag = font.family === 'Bangers' 
                 ? `\\frz${Math.random() > 0.5 ? 5 : -5}` 
                 : '';

            const text = `{${posTag}${scaleTag}${blurTag}${rotateTag}}${wt.word}`;
            events += `Dialogue: 0,${formatTime(absStart)},${formatTime(absEnd)},CustomStyle,,0,0,0,,${text}\n`;
        });
    }

    // B. KARAOKE (Highlight word in full sentence)
    else if (animationId === 'karaoke') {
        timestamps.forEach((wt, index) => {
            const absStart = globalOffset + wt.start;
            const absEnd = globalOffset + wt.end;
            const inactiveColor = '&HAAAAAA&'; 

            const renderedLine = timestamps?.map((t, i) => {
                if (i === index) {
                    const extra = blur > 0 ? `\\blur${blur}` : '';
                    const scale = '\\fscx110\\fscy110';
                    return `{\\c${primaryColor}${scale}${extra}}${t.word}{\\fscx100\\fscy100}`; 
                }
                return `{\\c${inactiveColor}\\blur0}${t.word}`;
            }).join(" ");

            // Prepend position tag to the whole line
            events += `Dialogue: 0,${formatTime(absStart)},${formatTime(absEnd)},CustomStyle,,0,0,0,,{${posTag}}${renderedLine}\n`;
        });
    }

    // C. TYPEWRITER (Accumulate)
    else if (animationId === 'typewriter') {
        let accumulatedText = "";
        
        timestamps.forEach((wt) => {
            const absStart = globalOffset + wt.start;
            const segmentEnd = globalOffset + wt.end;
            
            accumulatedText += (accumulatedText ? " " : "") + wt.word;
            const text = accumulatedText + "_";
            
            events += `Dialogue: 0,${formatTime(absStart)},${formatTime(segmentEnd)},CustomStyle,,0,0,0,,{${posTag}}${text}\n`;
        });
    }

    // D. STATIC (Simple)
    else {
         const blurTag = blur > 0 ? `\\blur${blur}` : '';
         const text = `{${posTag}${blurTag}}${sentence.text}`;
         events += `Dialogue: 0,${formatTime(globalOffset)},${formatTime(globalOffset + duration)},CustomStyle,,0,0,0,,${text}\n`;
    }

    globalOffset += duration;
  });

  return ASS_HEADER + events;
};
