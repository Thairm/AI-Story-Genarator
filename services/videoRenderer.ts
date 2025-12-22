
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VideoConfig, ScriptSentence } from '../types';
import { BACKGROUNDS } from '../constants';
import { generateASS } from '../utils/subtitleGenerator';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  // Load FFmpeg from CDN (using unpkg for stability with core files)
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const renderVideo = async (
  config: VideoConfig, 
  onProgress: (progress: number) => void
): Promise<string | null> => {
  try {
    const ffmpegInstance = await loadFFmpeg();
    
    // Progress Handler
    ffmpegInstance.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });

    onProgress(5); // Started

    // 1. Load Fonts
    // Inter (Standard & Hormozi)
    await ffmpegInstance.writeFile('Inter.ttf', await fetchFile('https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Black.ttf'));
    
    // Roboto Mono (Typewriter)
    await ffmpegInstance.writeFile('RobotoMono.ttf', await fetchFile('https://raw.githubusercontent.com/google/fonts/main/ofl/robotomono/RobotoMono-Bold.ttf'));
    
    // Bangers (Comic)
    await ffmpegInstance.writeFile('Bangers.ttf', await fetchFile('https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/Bangers-Regular.ttf'));

    onProgress(15); // Fonts loaded

    // 2. Load Background Video
    const bgOption = BACKGROUNDS.find(b => b.id === config.backgroundId);
    if (!bgOption || !bgOption.videoUrl) throw new Error("Invalid Background");
    
    await ffmpegInstance.writeFile('input.mp4', await fetchFile(bgOption.videoUrl));
    
    onProgress(25); // Video loaded

    // 3. Process Audio (The Offset Strategy)
    // We need to stitch multiple audio clips into one track.
    const allSentences: ScriptSentence[] = config.script.flatMap(s => s.sentences);
    const audioSentences = allSentences.filter(s => s.audioUrl);
    
    let hasAudio = audioSentences.length > 0;
    
    if (hasAudio) {
      // Write all individual audio clips to the virtual FS
      let fileList = '';
      for (let i = 0; i < audioSentences.length; i++) {
        const filename = `audio_${i}.mp3`;
        if (audioSentences[i].audioUrl) {
            await ffmpegInstance.writeFile(filename, await fetchFile(audioSentences[i].audioUrl!));
            fileList += `file '${filename}'\n`;
        }
      }
      
      // Create the concat list file
      await ffmpegInstance.writeFile('list.txt', fileList);
    } else {
       // Fallback Mock Audio if no generation happened (prevent crash)
       const mockAudioUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'; 
       await ffmpegInstance.writeFile('fallback.mp3', await fetchFile(mockAudioUrl));
    }

    onProgress(40); // Audio prepared

    // 4. Generate Subtitles (.ass)
    // Pass the separated Animation, Theme, Font, and Position config (Including X and Scale)
    const assContent = generateASS(
        config.script, 
        config.captionAnimationId, 
        config.captionThemeId, 
        config.captionFontId, 
        config.captionY,
        config.captionX,
        config.captionScale
    );
    await ffmpegInstance.writeFile('subs.ass', assContent);
    
    onProgress(50); // Ready to render

    // 5. Execute FFmpeg
    // If we have multiple audio files, we use the concat demuxer
    const inputArgs = hasAudio 
      ? ['-f', 'concat', '-safe', '0', '-i', 'list.txt'] 
      : ['-i', 'fallback.mp3'];

    await ffmpegInstance.exec([
      '-i', 'input.mp4',
      ...inputArgs,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,ass=subs.ass:fontsdir=/',
      '-c:v', 'libx264',
      '-preset', 'ultrafast', 
      '-shortest',
      '-map', '0:v', 
      '-map', '1:a', 
      'output.mp4'
    ]);

    onProgress(95); // Processing done

    // 6. Read Output
    const data = await ffmpegInstance.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    onProgress(100);
    return url;

  } catch (error) {
    console.error("FFmpeg Render Error:", error);
    return null;
  }
};
