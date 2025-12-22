
import React from 'react';
import { LayoutTemplate, ArrowRight, Sparkles, Mic2, MonitorPlay, Check, Zap, Globe, Wand2 } from 'lucide-react';

interface LandingPageProps {
    onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500/30 overflow-y-auto">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <LayoutTemplate className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">StoryForge</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <button
                        onClick={onLaunch}
                        className="bg-orange-500 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-900/20 flex items-center group"
                    >
                        Launch Studio
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
                {/* Abstract Background Glow */}
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] -z-10"></div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text & CTAs */}
                    <div className="text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                            <span className="text-xs font-medium text-orange-300">New: Viral Story Generation</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Create Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Faceless Videos</span> in Seconds.
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-lg mb-10 leading-relaxed">
                            Generate unlimited unique Reddit-style stories and turn them into monetized TikToks & Shorts using AI.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <button
                                onClick={onLaunch}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center"
                            >
                                Start Creating Free
                                <Zap className="w-5 h-5 ml-2 fill-zinc-950" />
                            </button>
                            <a href="#workflow" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-medium text-lg hover:bg-zinc-800 transition-colors flex items-center justify-center">
                                View Demo
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Conveyor Animation */}
                    <div className="relative h-[550px] overflow-hidden hidden md:flex items-center justify-center">
                        {/* Fade Gradients */}
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>

                        {/* Conveyor Track */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="animate-conveyor flex gap-6" style={{ animationDuration: '25s' }}>
                                {/* Card Set 1 (Original) */}
                                {[
                                    { label: 'Daily Motivation Shorts', gradient: 'from-orange-500 to-red-500' },
                                    { label: 'Faceless Fitness Clips', gradient: 'from-emerald-500 to-teal-500' },
                                    { label: 'Business Tips Videos', gradient: 'from-blue-500 to-amber-500' },
                                    { label: 'AI Story Shorts', gradient: 'from-purple-500 to-pink-500' },
                                    { label: 'Scary Reddit Stories', gradient: 'from-zinc-600 to-zinc-800' },
                                    { label: 'Life Hack Reels', gradient: 'from-amber-500 to-orange-500' },
                                ].map((card, i) => (
                                    <div
                                        key={`card-a-${i}`}
                                        className="flex-shrink-0 w-48 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden relative group"
                                    >
                                        {/* Gradient Header */}
                                        <div className={`h-16 bg-gradient-to-br ${card.gradient} opacity-80`}></div>
                                        {/* Content Area */}
                                        <div className="p-4 flex flex-col h-[calc(100%-64px)]">
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                                                <div className="h-2 w-1/2 bg-zinc-800 rounded"></div>
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-300 mt-auto leading-tight">{card.label}</p>
                                        </div>
                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                    </div>
                                ))}
                                {/* Card Set 2 (Duplicate for seamless loop) */}
                                {[
                                    { label: 'Daily Motivation Shorts', gradient: 'from-orange-500 to-red-500' },
                                    { label: 'Faceless Fitness Clips', gradient: 'from-emerald-500 to-teal-500' },
                                    { label: 'Business Tips Videos', gradient: 'from-blue-500 to-amber-500' },
                                    { label: 'AI Story Shorts', gradient: 'from-purple-500 to-pink-500' },
                                    { label: 'Scary Reddit Stories', gradient: 'from-zinc-600 to-zinc-800' },
                                    { label: 'Life Hack Reels', gradient: 'from-amber-500 to-orange-500' },
                                ].map((card, i) => (
                                    <div
                                        key={`card-b-${i}`}
                                        className="flex-shrink-0 w-48 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden relative group"
                                    >
                                        <div className={`h-16 bg-gradient-to-br ${card.gradient} opacity-80`}></div>
                                        <div className="p-4 flex flex-col h-[calc(100%-64px)]">
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                                                <div className="h-2 w-1/2 bg-zinc-800 rounded"></div>
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-300 mt-auto leading-tight">{card.label}</p>
                                        </div>
                                        <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24 bg-zinc-900/50 border-y border-zinc-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
                        <p className="text-zinc-400">From idea to viral video in three simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="relative p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-colors">
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-800">
                                <Wand2 className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">1. Describe your Story</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Enter a topic like "AITA for..." or "A scary story about...". Our AI generates a unique, engaging script instantly.
                            </p>
                        </div>

                        <div className="relative p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-colors">
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-800">
                                <Sparkles className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">2. AI Visualization</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Select a gameplay background and an AI narrator. We automatically generate voiceovers and captions.
                            </p>
                        </div>

                        <div className="relative p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-colors">
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-800">
                                <MonitorPlay className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">3. Publish & Profit</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Export in HD 1080p (9:16). Ready for TikTok, Instagram Reels, and YouTube Shorts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Everything you need to go viral</h2>
                    <p className="text-zinc-400">Professional tools built for the faceless content economy.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <Mic2 className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">ElevenLabs Voices</h3>
                            <p className="text-zinc-400">Access premium, ultra-realistic AI narrators. From deep storytelling voices to energetic viral tones.</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <Globe className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Auto-Captions</h3>
                            <p className="text-zinc-400">Perfectly synced karaoke-style subtitles that increase watch time and retention by up to 40%.</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <LayoutTemplate className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Copyright Free Visuals</h3>
                            <p className="text-zinc-400">Choose from our library of high-retention gameplay (Minecraft, GTA, Subway Surfers) or upload your own.</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">HD 60fps Export</h3>
                            <p className="text-zinc-400">Render crisp 1080x1920 videos optimized for the algorithms of all major short-form platforms.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-zinc-900/50 border-y border-zinc-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
                        <p className="text-zinc-400">Start for free, upgrade as you grow.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Starter */}
                        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-zinc-300 mb-2">Starter</h3>
                                <p className="text-4xl font-bold text-white">$0<span className="text-base text-zinc-500 font-normal">/mo</span></p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> 2 Videos per month</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> 720p Export</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> Standard Voices</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> Watermarked</li>
                            </ul>
                            <button onClick={onLaunch} className="w-full py-3 rounded-xl border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">Start for Free</button>
                        </div>

                        {/* Creator Pro */}
                        <div className="p-8 rounded-2xl border-2 border-orange-500 bg-zinc-900/50 flex flex-col relative scale-105 shadow-2xl shadow-orange-900/20">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Most Popular
                            </div>
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-orange-400 mb-2">Creator Pro</h3>
                                <p className="text-4xl font-bold text-white">$29<span className="text-base text-zinc-500 font-normal">/mo</span></p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-white"><Check className="w-4 h-4 text-amber-500 mr-3" /> 30 Videos per month</li>
                                <li className="flex items-center text-white"><Check className="w-4 h-4 text-amber-500 mr-3" /> 1080p 60fps Export</li>
                                <li className="flex items-center text-white"><Check className="w-4 h-4 text-amber-500 mr-3" /> Premium ElevenLabs Voices</li>
                                <li className="flex items-center text-white"><Check className="w-4 h-4 text-amber-500 mr-3" /> No Watermark</li>
                            </ul>
                            <button onClick={onLaunch} className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-amber-500 transition-colors">Get Started</button>
                        </div>

                        {/* Agency */}
                        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-zinc-300 mb-2">Agency</h3>
                                <p className="text-4xl font-bold text-white">$99<span className="text-base text-zinc-500 font-normal">/mo</span></p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> Unlimited Videos</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> Priority Rendering</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> Custom Branding</li>
                                <li className="flex items-center text-zinc-400"><Check className="w-4 h-4 text-zinc-600 mr-3" /> API Access</li>
                            </ul>
                            <button onClick={onLaunch} className="w-full py-3 rounded-xl border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
                            <LayoutTemplate className="w-3 h-3 text-zinc-400" />
                        </div>
                        <span className="text-lg font-bold text-zinc-300">StoryForge</span>
                    </div>

                    <div className="flex space-x-8 text-sm text-zinc-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-zinc-600">
                    &copy; {new Date().getFullYear()} StoryForge AI Inc. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
