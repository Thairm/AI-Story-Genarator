
import React, { useState, useEffect } from 'react';
import { VideoConfig, GenerationStatus, ScriptSection, ScriptSentence, AnimationType, DEFAULT_SYSTEM_PROMPT } from '../types';
import { NARRATORS, BACKGROUNDS, CAPTION_ANIMATIONS, CAPTION_THEMES, CAPTION_FONTS } from '../constants';
import { Wand2, ScrollText, Captions, Play, Trash2, Plus, GripVertical, RefreshCw, Volume2, Pause, AlertCircle, Palette, Type as TypeIcon, Settings } from 'lucide-react';
import { enhanceStoryPrompt } from '../services/geminiService';
import { renderVideo } from '../services/videoRenderer';
import { generateSpeech } from '../services/audioService';
import { localStorageProvider } from '../services/storage/videoHistoryService';
import SystemPromptModal from './SystemPromptModal';

interface ConfigPanelProps {
  config: VideoConfig;
  status: GenerationStatus;
  onConfigChange: (newConfig: VideoConfig) => void;
  onGenerate: () => void;
  setStatus: (status: GenerationStatus) => void;
  setVideoUrl: (url: string | null) => void;
  setProgress: (progress: number) => void;
  progress: number;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// --- LIVE PREVIEW COMPONENT ---
const LiveCaptionPreview = ({
  animationId,
  themeId,
  fontId
}: {
  animationId: AnimationType,
  themeId: string,
  fontId: string
}) => {
  const theme = CAPTION_THEMES.find(t => t.id === themeId) || CAPTION_THEMES[0];
  const font = CAPTION_FONTS.find(f => f.id === fontId) || CAPTION_FONTS[0];

  const WORDS = ["Create", "Viral", "Videos"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  // Animation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (animationId === 'typewriter') {
      const fullText = WORDS.join(" ");
      setVisibleCount(0);
      interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev >= fullText.length) {
            setTimeout(() => setVisibleCount(0), 1000);
            return fullText.length;
          }
          return prev + 1;
        });
      }, 100);
    } else {
      setCurrentIndex(0);
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % WORDS.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [animationId]);

  // Determine Font Family for Preview
  const getFontFamily = () => {
    if (font.family === 'Bangers') return '"Bangers", cursive';
    if (font.family === 'RobotoMono') return '"Roboto Mono", monospace';
    return '"Inter", sans-serif';
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: getFontFamily(),
    fontWeight: font.family === 'Bangers' ? '400' : '900', // Bangers is bold by default
    fontSize: '1.5rem',
    textAlign: 'center',
    color: '#52525b', // inactive gray
    textShadow: 'none',
    letterSpacing: font.family === 'Bangers' ? '1px' : 'normal'
  };

  const activeStyle: React.CSSProperties = {
    color: theme.primaryColor,
    // Simulate ASS Border/Shadow
    textShadow: theme.isNeon
      ? `0 0 10px ${theme.secondaryColor}, 0 0 20px ${theme.secondaryColor}`
      : `2px 2px 0px ${theme.secondaryColor}, -1px -1px 0 #000`, // Hard drop shadow
    transform: animationId !== 'typewriter' ? 'scale(1.1)' : 'none',
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="flex items-center justify-center h-28 w-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

      <div style={containerStyle} className="z-10 flex space-x-2 px-4">
        {animationId === 'popup' && (
          <span className="animate-[bounce_0.3s_ease-out]" style={activeStyle}>
            {WORDS[currentIndex]}
          </span>
        )}
        {animationId === 'karaoke' && (
          <>
            {WORDS.map((word, i) => (
              <span key={i} style={i === currentIndex ? activeStyle : {}}>
                {word}
              </span>
            ))}
          </>
        )}
        {animationId === 'typewriter' && (
          <span style={{ color: theme.primaryColor, textShadow: activeStyle.textShadow }}>
            {WORDS.join(" ").substring(0, visibleCount)}
            <span className="animate-pulse">_</span>
          </span>
        )}
        {animationId === 'static' && (
          <span style={activeStyle}>
            Create Viral Videos
          </span>
        )}
      </div>

      <div className="absolute top-2 right-2 text-[9px] text-zinc-600 font-mono uppercase border border-zinc-800 px-1 rounded">
        {font.name} • {theme.name}
      </div>
    </div>
  );
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, status, onConfigChange, setStatus, setVideoUrl, setProgress, progress }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  const handleEnhance = async () => {
    // If empty prompt, don't run
    if (!config.prompt) return;

    setIsEnhancing(true);
    setStatus(GenerationStatus.GENERATING_SCRIPT);

    try {
      const result: ScriptSection[] = await enhanceStoryPrompt(config.prompt, customSystemPrompt);
      onConfigChange({ ...config, script: result });
    } finally {
      setIsEnhancing(false);
      setStatus(GenerationStatus.IDLE);
    }
  };

  const handleGenerateAudio = async () => {
    if (config.script.length === 0) return;

    setStatus(GenerationStatus.GENERATING_AUDIO);

    try {
      // Deep clone script to avoid mutation issues
      const newScript = [...config.script];
      let updatedCount = 0;

      for (let i = 0; i < newScript.length; i++) {
        const section = newScript[i];
        const newSentences: ScriptSentence[] = [];

        for (let j = 0; j < section.sentences.length; j++) {
          const sentence = section.sentences[j];
          // Only generate if no audio exists or if text changed (implied by user action usually, but here we just check existence)
          if (!sentence.audioUrl) {
            const updatedSentence = await generateSpeech(sentence, config.narratorId);
            newSentences.push(updatedSentence);
            updatedCount++;
          } else {
            newSentences.push(sentence);
          }
        }
        newScript[i] = { ...section, sentences: newSentences };
      }

      onConfigChange({ ...config, script: newScript });

    } catch (e) {
      console.error(e);
      alert("Failed to generate audio.");
    } finally {
      setStatus(GenerationStatus.IDLE);
    }
  };

  const handleGenerateVideo = async () => {
    if (config.script.length === 0) {
      alert("Please generate a script first!");
      return;
    }

    // Auto-generate audio if missing
    const hasMissingAudio = config.script.some(s => s.sentences.some(sen => !sen.audioUrl));
    if (hasMissingAudio) {
      // Optional: Could prompt user, but auto-generating is smoother
      await handleGenerateAudio();
    }

    setStatus(GenerationStatus.GENERATING_VIDEO);
    setVideoUrl(null);
    setProgress(0);

    const url = await renderVideo(config, (p) => setProgress(p));

    if (url) {
      setVideoUrl(url);
      setStatus(GenerationStatus.COMPLETED);

      // Auto-save to video history
      try {
        await localStorageProvider.saveProject(config);
        console.log('Project saved to history');
      } catch (e) {
        console.error('Failed to save project:', e);
      }
    } else {
      setStatus(GenerationStatus.ERROR);
      alert("Video generation failed. Please try again.");
    }
  };

  const updateConfig = (key: keyof VideoConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const toggleVoicePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Mock audio play duration
      setTimeout(() => {
        setPlayingVoiceId(prev => prev === voiceId ? null : prev);
      }, 3000);
    }
  };

  // --- Script Manipulation Helpers ---

  const updateSentenceText = (sectionId: string, sentenceId: string, newText: string) => {
    const newScript = config.script.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        sentences: section.sentences.map(s => s.id === sentenceId ? { ...s, text: newText, audioUrl: undefined, duration: undefined } : s)
      };
    });
    updateConfig('script', newScript);
  };

  const deleteSentence = (sectionId: string, sentenceId: string) => {
    const newScript = config.script.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        sentences: section.sentences.filter(s => s.id !== sentenceId)
      };
    }).filter(section => section.sentences.length > 0); // Remove empty sections
    updateConfig('script', newScript);
  };

  const addSentence = (sectionId: string) => {
    const newScript = config.script.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        sentences: [...section.sentences, { id: generateId(), text: "", isLocked: false }]
      };
    });
    updateConfig('script', newScript);
  };

  const addSection = () => {
    const newSection: ScriptSection = {
      id: generateId(),
      title: "New Section",
      sentences: [{ id: generateId(), text: "", isLocked: false }]
    };
    updateConfig('script', [...config.script, newSection]);
  };

  const regenerateSentenceAudio = async (sectionId: string, sentence: ScriptSentence) => {
    setStatus(GenerationStatus.GENERATING_AUDIO);
    try {
      const updatedSentence = await generateSpeech(sentence, config.narratorId);

      const newScript = config.script.map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          sentences: section.sentences.map(s => s.id === sentence.id ? updatedSentence : s)
        };
      });

      onConfigChange({ ...config, script: newScript });
    } finally {
      setStatus(GenerationStatus.IDLE);
    }
  };

  const playSentenceAudio = (sentence: ScriptSentence) => {
    if (sentence.audioUrl) {
      const audio = new Audio(sentence.audioUrl);
      audio.play();
    }
  };

  const isGenerating = status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETED && status !== GenerationStatus.ERROR;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-zinc-900">
      <div className="max-w-3xl mx-auto px-8 py-10 pb-32">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Reddit Story</h1>
          <p className="text-zinc-400 mt-2">Generate a viral Reddit-style story from a simple prompt.</p>
        </header>

        <div className="space-y-12">
          {/* Step 1: The Story (Updated: Removed Tabs, Prompt Only) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-xs flex items-center justify-center mr-3 text-zinc-300">1</span>
                Story Concept
              </h2>
              <button
                onClick={() => setIsPromptModalOpen(true)}
                className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Customize AI System Prompt"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="p-5">
                <div className="relative">
                  <textarea
                    value={config.prompt}
                    onChange={(e) => updateConfig('prompt', e.target.value)}
                    placeholder="e.g. AITA for refusing to pay for my sister's wedding? I (25M) made a fortune in crypto and she demanded I fund her venue..."
                    className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none transition-all"
                  />
                </div>

                {/* Generated Script Block Editor */}
                <div className="mt-8 pt-6 border-t border-zinc-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-orange-400 flex items-center mr-2">
                        <ScrollText className="w-4 h-4 mr-2" />
                        AI Generated Script
                      </label>
                      <button
                        onClick={handleEnhance}
                        disabled={isEnhancing || isGenerating || !config.prompt}
                        className="text-xs bg-orange-500 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-orange-900/20"
                      >
                        {isEnhancing ? (
                          <>
                            <Wand2 className="w-3 h-3 mr-1.5 animate-spin" />
                            Writing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3 h-3 mr-1.5" />
                            Write Script
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleGenerateAudio}
                        disabled={config.script.length === 0 || isGenerating}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-3 py-1.5 rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {status === GenerationStatus.GENERATING_AUDIO ? (
                          <>
                            <Wand2 className="w-3 h-3 mr-1.5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 mr-1.5" />
                            Generate Audio
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {config.script.length === 0 ? (
                    <div className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600">
                      <ScrollText className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm">No script generated yet.</p>
                      <p className="text-xs mt-1">Enter a story concept above and click "Write Script"</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {config.script.map((section, sectionIndex) => (
                        <div key={section.id} className="bg-zinc-900/50 border border-zinc-700 rounded-lg overflow-hidden">
                          {/* Section Header */}
                          <div className="bg-zinc-800/80 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">SECTION {sectionIndex + 1}</span>
                          </div>

                          {/* Sentences */}
                          <div className="divide-y divide-zinc-800">
                            {section.sentences.map((sentence, sentenceIndex) => (
                              <div key={sentence.id} className="group relative flex items-start p-3 hover:bg-zinc-800/30 transition-colors">
                                {/* Drag Handle (Visual only for now) */}
                                <div className="mt-2 mr-3 cursor-grab text-zinc-700 group-hover:text-zinc-500">
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Text Input */}
                                <div className="flex-1 min-w-0">
                                  <textarea
                                    value={sentence.text}
                                    onChange={(e) => updateSentenceText(section.id, sentence.id, e.target.value)}
                                    className="w-full bg-transparent text-sm text-zinc-200 focus:outline-none resize-none overflow-hidden min-h-[1.5rem]"
                                    rows={Math.max(1, Math.ceil(sentence.text.length / 80))}
                                    placeholder="Type a sentence..."
                                  />
                                  {sentence.audioUrl && (
                                    <div className="flex items-center mt-2">
                                      <div className="h-1 bg-amber-500/20 rounded-full w-24 overflow-hidden">
                                        <div className="h-full bg-amber-500 w-full"></div>
                                      </div>
                                      <span className="ml-2 text-[10px] text-zinc-500">Audio Ready ({sentence.duration?.toFixed(1)}s)</span>
                                    </div>
                                  )}
                                  {!sentence.audioUrl && sentence.text && (
                                    <div className="flex items-center mt-2">
                                      <AlertCircle className="w-3 h-3 text-amber-500 mr-1" />
                                      <span className="text-[10px] text-amber-500/80">Audio needs update</span>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                                  <button
                                    onClick={() => regenerateSentenceAudio(section.id, sentence)}
                                    className="p-1.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-orange-400 transition-colors"
                                    title="Regenerate Audio for this sentence"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => playSentenceAudio(sentence)}
                                    disabled={!sentence.audioUrl}
                                    className="p-1.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-orange-400 transition-colors disabled:opacity-50"
                                    title="Preview Audio"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteSentence(section.id, sentence.id)}
                                    className="p-1.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-colors"
                                    title="Delete Sentence"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Sentence Button */}
                          <button
                            onClick={() => addSentence(section.id)}
                            className="w-full py-2 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Sentence
                          </button>
                        </div>
                      ))}

                      {/* Add Section Button */}
                      <button
                        onClick={addSection}
                        className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all flex flex-col items-center justify-center"
                      >
                        <Plus className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Add New Section</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Voice & Captions (UNCHANGED) */}
          <section>
            <h2 className="text-lg font-semibold text-white flex items-center mb-4">
              <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-xs flex items-center justify-center mr-3 text-zinc-300">2</span>
              Voice & Captions
            </h2>
            <div className="space-y-8">

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Narrator</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {NARRATORS.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => updateConfig('narratorId', n.id)}
                      className={`
                        flex items-center p-2 rounded-lg border cursor-pointer transition-all
                        ${config.narratorId === n.id
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'}
                      `}
                    >
                      <button
                        onClick={(e) => toggleVoicePreview(e, n.id)}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 transition-all
                          ${playingVoiceId === n.id
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-700 text-zinc-400 hover:bg-amber-500 hover:text-white'}
                        `}
                      >
                        {playingVoiceId === n.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-200 truncate">{n.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{n.style}</div>
                      </div>

                      {config.narratorId === n.id && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-1 shadow-[0_0_6px_rgba(99,102,241,0.8)]"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center justify-between">
                  <span>Caption Style Preview</span>
                  <span className="text-[10px] bg-amber-500/20 text-orange-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Live Render</span>
                </label>
                <LiveCaptionPreview
                  animationId={config.captionAnimationId}
                  themeId={config.captionThemeId}
                  fontId={config.captionFontId}
                />
              </div>

              {/* 3-WAY SELECTOR: ANIMATION, FONT, THEME */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Animation & Font */}
                <div className="space-y-6">
                  {/* Animation Selector */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center">
                      <Captions className="w-4 h-4 mr-1.5" />
                      Animation Behavior
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CAPTION_ANIMATIONS.map((anim) => (
                        <button
                          key={anim.id}
                          onClick={() => updateConfig('captionAnimationId', anim.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${config.captionAnimationId === anim.id
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-zinc-800/30 border-zinc-700 hover:bg-zinc-800'
                            }`}
                        >
                          <div className="text-sm font-bold text-white">{anim.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-1 leading-tight">{anim.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center">
                      <TypeIcon className="w-4 h-4 mr-1.5" />
                      Font Family
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CAPTION_FONTS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => updateConfig('captionFontId', font.id)}
                          className={`p-2 rounded-lg border text-center transition-all ${config.captionFontId === font.id
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-zinc-800/30 border-zinc-700 hover:bg-zinc-800'
                            }`}
                        >
                          <div className={`text-xl text-white mb-1 ${font.family === 'Bangers' ? 'font-[Bangers] tracking-wide' : font.family === 'RobotoMono' ? 'font-mono' : 'font-sans font-black'}`}>
                            Ag
                          </div>
                          <div className="text-[10px] font-medium text-zinc-400">{font.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Theme Selector */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-1.5" />
                    Color Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CAPTION_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateConfig('captionThemeId', theme.id)}
                        className={`relative h-14 rounded-lg border overflow-hidden transition-all flex items-center px-3 ${config.captionThemeId === theme.id
                          ? 'border-amber-500 ring-1 ring-amber-500/50 bg-zinc-800'
                          : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800'
                          }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-zinc-600 mr-3 shadow-sm flex-shrink-0"
                          style={{
                            backgroundColor: theme.primaryColor,
                            boxShadow: theme.isNeon ? `0 0 8px ${theme.secondaryColor}` : 'none',
                            borderColor: theme.secondaryColor
                          }}
                        ></div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium text-zinc-300">{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Step 3: Visuals (UNCHANGED) */}
          <section>
            <h2 className="text-lg font-semibold text-white flex items-center mb-4">
              <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-xs flex items-center justify-center mr-3 text-zinc-300">3</span>
              Background Video
            </h2>
            <div className="flex overflow-x-auto pb-6 gap-4 snap-x">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => updateConfig('backgroundId', bg.id)}
                  className={`group relative flex-shrink-0 w-36 md:w-44 aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all snap-center ${config.backgroundId === bg.id
                    ? 'border-amber-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]'
                    : 'border-zinc-800 hover:border-zinc-600 hover:scale-[1.02]'
                    }`}
                >
                  <img
                    src={bg.thumbnail}
                    alt={bg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {bg.videoUrl && (
                    <video
                      src={bg.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                  )}
                  <div className={`absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-20 ${config.backgroundId === bg.id ? 'bg-amber-500/10' : ''}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-left z-20">
                    <p className="text-xs font-medium text-white line-clamp-2">{bg.name}</p>
                  </div>
                  {config.backgroundId === bg.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md z-20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Generate Video Button (UNCHANGED) */}
          <section className="pt-8 border-t border-zinc-800">
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full bg-orange-500 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-lg font-semibold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center group"
            >
              {isGenerating ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                  {status === GenerationStatus.GENERATING_SCRIPT ? 'Writing Script...' :
                    status === GenerationStatus.GENERATING_AUDIO ? 'Generating Audio...' :
                      `Rendering Video (${progress}%)`}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-white group-hover:scale-110 transition-transform" />
                  Generate Video (2 Credits)
                </>
              )}
            </button>
          </section>
        </div>
      </div>

      {/* System Prompt Modal */}
      <SystemPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        currentPrompt={customSystemPrompt}
        onSave={setCustomSystemPrompt}
      />
    </div>
  );
};
