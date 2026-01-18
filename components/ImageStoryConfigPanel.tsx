
import React, { useState, useEffect, useRef } from 'react';
import { VideoConfig, GenerationStatus, ScriptSection, ScriptSentence, VoiceSettings, DEFAULT_VOICE_SETTINGS, DEFAULT_SYSTEM_PROMPT } from '../types';
import { NARRATORS, IMAGE_STYLES } from '../constants';
import { Wand2, ScrollText, Play, Trash2, Plus, GripVertical, RefreshCw, Volume2, Pause, Image as ImageIcon, Sparkles, ChevronDown, Rocket, LayoutTemplate, Palette } from 'lucide-react';
import { enhanceStoryPrompt } from '../services/geminiService';
import { generateSpeech } from '../services/audioService';
import { generateImageForScene } from '../services/imageService';
import { localStorageProvider } from '../services/storage/videoHistoryService';
import { generateStoryIdea } from '../services/ideaService';
import SystemPromptModal from './SystemPromptModal';
import { Credits } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

// Horror-specific categories
const HORROR_CATEGORIES = [
    { id: 'random', name: '🎲 Surprise Me' },
    { id: 'urban_legend', name: '👻 Urban Legend' },
    { id: 'creepypasta', name: '💀 Creepypasta' },
    { id: 'true_crime', name: '🔪 True Crime' },
    { id: 'paranormal', name: '🏚️ Paranormal Activity' },
    { id: 'glitch', name: '👾 Glitch in Matrix' },
    { id: 'deep_sea', name: '🦑 Deep Sea Horror' },
];

interface ImageStoryConfigPanelProps {
    config: VideoConfig;
    status: GenerationStatus;
    onConfigChange: (newConfig: VideoConfig) => void;
    onGenerate: () => void;
    setStatus: (status: GenerationStatus) => void;
    setVideoUrl: (url: string | null) => void;
    setProgress: (progress: number) => void;
    progress: number;
    user?: User | null;
    credits?: Credits | null;
    onCreditsUsed?: () => void;
    onBack?: () => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const ImageStoryConfigPanel: React.FC<ImageStoryConfigPanelProps> = ({ config, status, onConfigChange, setStatus, setVideoUrl, setProgress, progress, user, credits, onCreditsUsed, onBack }) => {
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [customSystemPrompt, setCustomSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
    const [selectedCategory, setSelectedCategory] = useState('random');
    const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
    const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
    const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- Handlers ---

    const updateConfig = (key: keyof VideoConfig, value: any) => {
        onConfigChange({ ...config, [key]: value });
    };

    const handleGenerateIdea = async () => {
        setIsGeneratingIdea(true);
        try {
            const idea = await generateStoryIdea(selectedCategory);
            if (idea) updateConfig('prompt', idea);
        } catch (error) {
            console.error('Failed to generate idea:', error);
        } finally {
            setIsGeneratingIdea(false);
        }
    };

    const handleEnhance = async () => {
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
            const newScript = [...config.script];
            for (let i = 0; i < newScript.length; i++) {
                const section = newScript[i];
                const newSentences: ScriptSentence[] = [];
                for (let j = 0; j < section.sentences.length; j++) {
                    const sentence = section.sentences[j];
                    if (!sentence.audioUrl) {
                        const updatedSentence = await generateSpeech(sentence, config.narratorId, voiceSettings);
                        newSentences.push(updatedSentence);
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

    const handleGenerateImage = async (sectionId: string, sentence: ScriptSentence) => {
        const style = IMAGE_STYLES.find(s => s.id === config.imageStyleId) || IMAGE_STYLES[0];
        setGeneratingImageId(sentence.id);
        setStatus(GenerationStatus.GENERATING_IMAGES);

        try {
            const imageUrl = await generateImageForScene(sentence, style, config.prompt);

            const newScript = config.script.map(section => {
                if (section.id !== sectionId) return section;
                return {
                    ...section,
                    sentences: section.sentences.map(s => s.id === sentence.id ? { ...s, imageUrl, imagePrompt: style.name } : s)
                };
            });
            updateConfig('script', newScript);

        } catch (e) {
            console.error(e);
            alert("Failed to generate image");
        } finally {
            setGeneratingImageId(null);
            setStatus(GenerationStatus.IDLE);
        }
    };

    const handleGenerateAllImages = async () => {
        const style = IMAGE_STYLES.find(s => s.id === config.imageStyleId) || IMAGE_STYLES[0];
        setStatus(GenerationStatus.GENERATING_IMAGES);

        // Process sequentially to define context better/avoid rate limits
        // Or parallel? DALL-E rate limits are strict. Sequential is safer.

        try {
            const newScript = [...config.script];
            for (let i = 0; i < newScript.length; i++) {
                const section = newScript[i];
                const newSentences: ScriptSentence[] = [];
                for (let j = 0; j < section.sentences.length; j++) {
                    const sentence = section.sentences[j];
                    if (!sentence.imageUrl) {
                        setGeneratingImageId(sentence.id);
                        const imageUrl = await generateImageForScene(sentence, style, config.prompt);
                        newSentences.push({ ...sentence, imageUrl, imagePrompt: style.id });
                    } else {
                        newSentences.push(sentence);
                    }
                }
                newScript[i] = { ...section, sentences: newSentences };
                // Update implementation state incrementally so user sees progress
                onConfigChange({ ...config, script: [...newScript] });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setGeneratingImageId(null);
            setStatus(GenerationStatus.IDLE);
        }
    }


    const toggleVoicePreview = async (e: React.MouseEvent, voiceId: string) => {
        e.stopPropagation();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (playingVoiceId === voiceId) {
            setPlayingVoiceId(null);
        } else {
            const voice = NARRATORS.find(n => n.id === voiceId);
            if (voice && voice.previewUrl) {
                setPlayingVoiceId(voiceId);
                const audio = new Audio(voice.previewUrl);
                audioRef.current = audio;
                audio.play().catch(() => setPlayingVoiceId(null));
                audio.onended = () => {
                    setPlayingVoiceId(null);
                    audioRef.current = null;
                }
            }
        }
    };

    const isGenerating = status !== GenerationStatus.IDLE;

    return (
        <div className="flex-1 h-full overflow-y-auto bg-zinc-950">
            <div className="max-w-4xl mx-auto px-8 py-10 pb-32">

                {/* Header */}
                <header className="mb-10">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors group text-sm font-medium"
                        >
                            ← Back to Content Types
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <LayoutTemplate className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">AI Horror Story</h1>
                            <p className="text-zinc-400 mt-1">Create spooky visual stories with AI-generated scenes.</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-12">

                    {/* 1. Story Concept */}
                    <section className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                        <h2 className="text-lg font-semibold text-white flex items-center mb-6">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center mr-3 border border-purple-500/20">1</span>
                            Story Concept
                        </h2>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    {HORROR_CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            </div>
                            <button
                                onClick={handleGenerateIdea}
                                disabled={isGeneratingIdea || isGenerating}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/30 text-purple-100 text-sm font-medium rounded-lg transition-all"
                            >
                                <Sparkles className={`w-4 h-4 ${isGeneratingIdea ? 'animate-spin' : ''}`} />
                                Generate Idea
                            </button>
                        </div>

                        <textarea
                            value={config.prompt}
                            onChange={(e) => updateConfig('prompt', e.target.value)}
                            placeholder="Describe your horror story idea..."
                            className="w-full h-32 bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
                        />
                    </section>

                    {/* 2. Visual Style */}
                    <section className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                        <h2 className="text-lg font-semibold text-white flex items-center mb-6">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center mr-3 border border-purple-500/20">2</span>
                            Visual Style
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {IMAGE_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => updateConfig('imageStyleId', style.id)}
                                    className={`relative group overflow-hidden rounded-xl border text-left transition-all h-32 ${config.imageStyleId === style.id
                                        ? 'border-purple-500 ring-2 ring-purple-500/20'
                                        : 'border-zinc-800 hover:border-zinc-600'
                                        }`}
                                >
                                    <img src={style.previewUrl} alt={style.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                                        <span className="text-sm font-bold text-white block">{style.name}</span>
                                    </div>
                                    {config.imageStyleId === style.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 3. Scenes & Images */}
                    <section className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center mr-3 border border-purple-500/20">3</span>
                                Scenes & Images
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEnhance}
                                    disabled={!config.prompt || isGenerating}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors border border-zinc-700"
                                >
                                    <ScrollText className="w-4 h-4 inline mr-2" />
                                    {config.script.length > 0 ? 'Regenerate Script' : 'Generate Script'}
                                </button>
                                <button
                                    onClick={handleGenerateAllImages}
                                    disabled={config.script.length === 0 || isGenerating}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-purple-900/20"
                                >
                                    <ImageIcon className="w-4 h-4 inline mr-2" />
                                    Generate All Images
                                </button>
                            </div>
                        </div>

                        {config.script.length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-600">
                                <p>No scenes yet. Generate a script to start creating scenes.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {config.script.map((section, sIdx) => (
                                    <div key={section.id} className="space-y-6">
                                        {section.sentences.map((sentence, idx) => (
                                            <div key={sentence.id} className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
                                                {/* Text Area */}
                                                <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-zinc-800">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Scene {idx + 1}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => {/* Play audio */ }}
                                                                className={`p-1.5 rounded-md hover:bg-zinc-800 ${sentence.audioUrl ? 'text-purple-400' : 'text-zinc-600'}`}
                                                            >
                                                                <Volume2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        value={sentence.text}
                                                        readOnly
                                                        className="w-full bg-transparent text-zinc-300 text-sm resize-none focus:outline-none h-24"
                                                    />
                                                </div>

                                                {/* Image Area */}
                                                <div className="w-full md:w-48 lg:w-40 aspect-[9/16] relative bg-zinc-900 flex-shrink-0 group">
                                                    {sentence.imageUrl ? (
                                                        <>
                                                            <img src={sentence.imageUrl} alt="Scene" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    onClick={() => handleGenerateImage(section.id, sentence)}
                                                                    className="p-2 bg-zinc-800/80 rounded-full text-white hover:bg-purple-600 transition-colors"
                                                                >
                                                                    <RefreshCw className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                                            {generatingImageId === sentence.id ? (
                                                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleGenerateImage(section.id, sentence)}
                                                                    className="flex flex-col items-center text-zinc-600 hover:text-purple-400 transition-colors"
                                                                >
                                                                    <ImageIcon className="w-6 h-6 mb-2" />
                                                                    <span className="text-[10px] uppercase font-bold text-center">Generate</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
};
