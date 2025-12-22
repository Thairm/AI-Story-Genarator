import React, { useState } from 'react';
import { Book, FileText, HelpCircle, Lightbulb, ShieldQuestion } from 'lucide-react';

type DocSection = 'intro' | 'getting-started' | 'features' | 'faq';

interface DocContent {
    id: DocSection;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const DOCS: DocContent[] = [
    {
        id: 'intro',
        title: 'Introduction',
        icon: <Book size={18} />,
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Welcome to StoryForge</h1>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white mt-8">Overview</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        The AI Faceless Content Generator is a web-based platform that automatically creates short-form, engaging videos without requiring users to appear on camera, record audio, or even come up with an idea.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        With a single click, users can generate complete videos that combine AI-generated stories with popular background visuals such as Minecraft gameplay, Subway Surfers, Temple Run, and ASMR-style footage—formats proven to perform well on platforms like TikTok, YouTube Shorts, and Instagram Reels.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        The goal is simple: remove all friction from content creation and allow anyone to publish viral-style videos instantly.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">What Platform Does</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        The platform handles the entire content creation process automatically:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li>Generates a story or script using AI</li>
                        <li>Selects a suitable background video (Minecraft, Subway Surfers, Temple Run, or ASMR)</li>
                        <li>Combines everything into a finished video</li>
                        <li>Delivers a ready-to-post result in seconds</li>
                    </ul>

                    <p className="text-zinc-300 text-lg leading-relaxed mt-4">
                        Users don’t need to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li>Come up with ideas</li>
                        <li>Write scripts</li>
                        <li>Record themselves</li>
                        <li>Edit videos</li>
                    </ul>

                    <p className="text-zinc-300 text-lg leading-relaxed font-semibold text-orange-400 mt-2">
                        They simply press a button.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8">Supported Video Styles</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        The platform currently supports several popular faceless video formats:
                    </p>

                    <h3 className="text-xl font-semibold text-orange-400 mt-6">🎮 Gameplay Backgrounds</h3>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li>Minecraft</li>
                        <li>Subway Surfers</li>
                        <li>Temple Run</li>
                    </ul>
                    <p className="text-zinc-400 mt-2 ml-4">
                        These looping or dynamic visuals keep viewers engaged while the AI-generated story plays.
                    </p>

                    <h3 className="text-xl font-semibold text-orange-400 mt-6">🔊 ASMR-Style Videos</h3>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li>Visually calming or satisfying footage</li>
                        <li>Designed for relaxation, focus, or passive consumption</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8">Key Features</h2>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li><span className="font-semibold text-white">One-Click Video Generation</span> – No setup or creative input required</li>
                        <li><span className="font-semibold text-white">AI Story Generation</span> – Automatically creates engaging narratives</li>
                        <li><span className="font-semibold text-white">Faceless Content</span> – No camera, voice, or personal branding needed</li>
                        <li><span className="font-semibold text-white">Instant Results</span> – Videos are generated in seconds</li>
                        <li><span className="font-semibold text-white">Optimized for Short-Form Platforms</span> – Ideal for TikTok, Shorts, and Reels</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8">Who It’s For</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        This platform is ideal for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                        <li>Content creators who want to post consistently</li>
                        <li>Beginners with no editing or storytelling skills</li>
                        <li>People who don’t want to show their face online</li>
                        <li>Automation-focused creators running multiple accounts</li>
                        <li>Anyone looking to experiment with viral short-form content</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8">The Value Proposition</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        Traditional content creation takes time, creativity, and technical skill.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        The AI Faceless Content Generator replaces all of that with automation.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed font-semibold text-orange-400 mt-4">
                        Press a button → get a complete video.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed font-semibold text-white">
                        No ideas. No editing. No friction.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <h3 className="text-xl font-semibold text-orange-400 mb-2">AI Narrators</h3>
                        <p className="text-zinc-400">Choose from a variety of realistic AI voices to bring your stories to life with emotion and clarity.</p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <h3 className="text-xl font-semibold text-orange-400 mb-2">Dynamic Captions</h3>
                        <p className="text-zinc-400">Automatically generate word-by-word captions with customizable animations and themes.</p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <h3 className="text-xl font-semibold text-orange-400 mb-2">Visuals & Backgrounds</h3>
                        <p className="text-zinc-400">Select from our library of engaging backgrounds like Minecraft gameplay or upload your own.</p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <h3 className="text-xl font-semibold text-orange-400 mb-2">Instant Preview</h3>
                        <p className="text-zinc-400">See your changes in real-time before generating the final high-quality video.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <FileText size={18} />,
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Getting Started</h1>
                <p className="text-zinc-300 text-lg">
                    Follow these simple steps to create your first video in minutes.
                </p>

                <ol className="list-decimal list-inside space-y-4 text-zinc-300 mt-4">
                    <li className="pl-2"><span className="font-semibold text-white">Choose a Story Source:</span> Select "AI Reddit Story" to fetch content or write your own script.</li>
                    <li className="pl-2"><span className="font-semibold text-white">Customize the Script:</span> Edit the generated text, add hooks, and refine the narrative.</li>
                    <li className="pl-2"><span className="font-semibold text-white">Select a Voice:</span> Pick a narrator that fits the tone of your story.</li>
                    <li className="pl-2"><span className="font-semibold text-white">Style Your Video:</span> Choose a background video and customize the caption font and colors.</li>
                    <li className="pl-2"><span className="font-semibold text-white">Generate:</span> Click the "Generate Video" button and watch the magic happen!</li>
                </ol>
            </div>
        )
    },
    {
        id: 'features',
        title: 'Key Features',
        icon: <Lightbulb size={18} />,
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Key Features</h1>
                <p className="text-zinc-300">Explore the powerful tools at your disposal.</p>
                {/* Placeholder for detailed feature list */}
                <p className="text-zinc-500 italic">Detailed feature documentation is coming soon...</p>
            </div>
        )
    },
    {
        id: 'faq',
        title: 'FAQ',
        icon: <ShieldQuestion size={18} />,
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-white text-lg">Is it free to use?</h3>
                        <p className="text-zinc-400">Yes, StoryForge offers a free tier for you to try out the core features.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">Can I upload my own background videos?</h3>
                        <p className="text-zinc-400">Currently, we support a curated library of backgrounds, but custom uploads are on our roadmap.</p>
                    </div>
                </div>
            </div>
        )
    }
];

export const DocumentPanel: React.FC = () => {
    const [activeSection, setActiveSection] = useState<DocSection>('intro');

    const activeContent = DOCS.find(doc => doc.id === activeSection);

    return (
        <div className="flex h-full w-full bg-zinc-900">
            {/* Secondary Sidebar */}
            <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <HelpCircle className="text-orange-500" />
                        Documentation
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {DOCS.map((doc) => (
                        <button
                            key={doc.id}
                            onClick={() => setActiveSection(doc.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeSection === doc.id
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                }`}
                        >
                            <span className="mr-3">{doc.icon}</span>
                            {doc.title}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-zinc-900">
                <div className="max-w-4xl mx-auto p-12">
                    {activeContent?.content}
                </div>
            </div>
        </div>
    );
};
