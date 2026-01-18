import React from 'react';
import { MessageSquare, Image, Newspaper, MessagesSquare, Quote, Sparkles } from 'lucide-react';

export type ContentType = 'reddit-story' | 'image-story' | 'news-story' | 'chat-story' | 'quote-video';

interface ContentTypeOption {
    id: ContentType;
    name: string;
    description: string;
    icon: React.ReactNode;
    available: boolean;
    gradient: string;
}

const CONTENT_TYPES: ContentTypeOption[] = [
    {
        id: 'reddit-story',
        name: 'Reddit Story',
        description: 'AI-narrated viral stories with gameplay background',
        icon: <MessageSquare size={32} />,
        available: true,
        gradient: 'from-orange-500 to-red-600',
    },
    {
        id: 'image-story',
        name: 'Image Story',
        description: 'Stories with AI-generated images for each scene',
        icon: <Image size={32} />,
        available: false,
        gradient: 'from-purple-500 to-pink-600',
    },
    {
        id: 'news-story',
        name: 'News Story',
        description: 'Current events and trending topics narration',
        icon: <Newspaper size={32} />,
        available: false,
        gradient: 'from-blue-500 to-cyan-600',
    },
    {
        id: 'chat-story',
        name: 'Chat Story',
        description: 'Fake text message conversations and drama',
        icon: <MessagesSquare size={32} />,
        available: false,
        gradient: 'from-green-500 to-emerald-600',
    },
    {
        id: 'quote-video',
        name: 'Quote Video',
        description: 'Motivational quotes with aesthetic visuals',
        icon: <Quote size={32} />,
        available: false,
        gradient: 'from-amber-500 to-yellow-600',
    },
];

interface ContentTypeSelectorProps {
    onSelectType: (type: ContentType) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ onSelectType }) => {
    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Generate Video</h1>
                <p className="text-zinc-400">Choose a content type to start creating</p>
            </div>

            {/* Content Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONTENT_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => type.available && onSelectType(type.id)}
                        disabled={!type.available}
                        className={`
              relative group p-6 rounded-2xl border text-left transition-all duration-300
              ${type.available
                                ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                                : 'bg-zinc-900/50 border-zinc-800 cursor-not-allowed opacity-60'
                            }
            `}
                    >
                        {/* Icon with gradient background */}
                        <div className={`
              w-14 h-14 rounded-xl flex items-center justify-center mb-4
              bg-gradient-to-br ${type.gradient}
              ${type.available ? 'shadow-lg' : 'grayscale'}
            `}>
                            <span className="text-white">{type.icon}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            {type.name}
                            {!type.available && (
                                <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full">
                                    Coming Soon
                                </span>
                            )}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-400">{type.description}</p>

                        {/* Hover glow effect for available items */}
                        {type.available && (
                            <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-gradient-to-br ${type.gradient} blur-xl -z-10
              `} style={{ opacity: 0.1 }} />
                        )}
                    </button>
                ))}

                {/* More Coming Soon Card */}
                <div className="p-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-zinc-800 border border-zinc-700">
                        <Sparkles size={32} className="text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-500 mb-2">More Coming Soon</h3>
                    <p className="text-sm text-zinc-600">We're always adding new content types!</p>
                </div>
            </div>
        </div>
    );
};

export default ContentTypeSelector;
