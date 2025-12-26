
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

    // 3. Process Audio (The Offset Strategy)
    // We need to stitch multiple audio clips into one track.
    const allSentences: ScriptSentence[] = config.script.flatMap(s => s.sentences);
    const audioSentences = allSentences.filter(s => s.audioUrl);

    let hasAudio = audioSentences.length > 0;
    let totalAudioDuration = 0; // Estimate duration based on word count or metadata if available? 
    // Ideally we need real duration. For now, we rely on FFmpeg -shortest.
    // BUT for random start time, we need to know if we have enough room.
    // Let's assume a safe buffer or just pick a start time that isn't the very end.

    if (hasAudio) {
      // Write all individual audio clips to the virtual FS
      let fileList = '';
      for (let i = 0; i < audioSentences.length; i++) {
        const filename = `audio_${i}.mp3`;
        if (audioSentences[i].audioUrl) {
          await ffmpegInstance.writeFile(filename, await fetchFile(audioSentences[i].audioUrl!));
          fileList += `file '${filename}'\n`;
          // Note: We don't strictly know the duration here without probing. 
          // For now, we will use a conservative random start strategy.
        }
      }

      // Create the concat list file
      await ffmpegInstance.writeFile('list.txt', fileList);
    } else {
      // Fallback Mock Audio
      const mockAudioUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
      await ffmpegInstance.writeFile('fallback.mp3', await fetchFile(mockAudioUrl));
    }

    onProgress(40); // Audio prepared

    // 2. Load Background Video (Random Selection)
    const bgOption = BACKGROUNDS.find(b => b.id === config.backgroundId);
    if (!bgOption) throw new Error("Invalid Background");

    let selectedVideoUrl = "";
    let videoDuration = 300; // Default 5 mins

    // If we have multiple chunks, pick one randomly
    if (bgOption.videos && bgOption.videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * bgOption.videos.length);
      const selectedVideo = bgOption.videos[randomIndex];
      selectedVideoUrl = selectedVideo.url;
      videoDuration = selectedVideo.duration || 300;
    } else {
      // Fallback to preview if no full videos (shouldn't happen in prod)
      selectedVideoUrl = bgOption.previewUrl;
    }

    if (!selectedVideoUrl) throw new Error("No video URL found");

    await ffmpegInstance.writeFile('input.mp4', await fetchFile(selectedVideoUrl));

    onProgress(25); // Video loaded

    // Calculate Random Start Time
    // We want to start at a random point, but ensure we have enough video left for the audio.
    // Since we don't know exact audio duration easily without probing, let's assume audio is < 2 mins.
    // Video chunks are 5 mins (300s).
    // Safe Max Start = 300s - 120s = 180s.
    const safeMaxStart = Math.max(0, videoDuration - 120);
    const randomStartTime = Math.floor(Math.random() * safeMaxStart);

    // 4. Generate Subtitles (.ass)
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
    const inputArgs = hasAudio
      ? ['-f', 'concat', '-safe', '0', '-i', 'list.txt']
      : ['-i', 'fallback.mp3'];

    await ffmpegInstance.exec([
      '-ss', `${randomStartTime}`, // Seek BEFORE input to be fast
      '-i', 'input.mp4',
      ...inputArgs,
      // Removed scale/crop since videos are pre-cropped to 9:16
      '-vf', 'ass=subs.ass:fontsdir=/',
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
    const blob = new Blob([data as any], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    onProgress(100);
    return url;

  } catch (error) {
    console.error("FFmpeg Render Error:", error);
    return null;
  }
};
