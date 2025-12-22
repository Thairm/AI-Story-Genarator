import React from 'react';
import { SavedVideoProject } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

interface VideoCardProps {
    project: SavedVideoProject;
    onEdit: (project: SavedVideoProject) => void;
    onDelete: (projectId: string) => void;
}

// Helper to format relative time
function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) {
        return date.toLocaleDateString();
    } else if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

export const VideoCard: React.FC<VideoCardProps> = ({ project, onEdit, onDelete }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    const handleDelete = () => {
        if (showDeleteConfirm) {
            onDelete(project.id);
            setShowDeleteConfirm(false);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    return (
        <div className="group flex flex-col bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
            {/* Thumbnail - Takes up most of the card (9:16 aspect ratio) */}
            <div className="relative w-full aspect-[9/16] bg-zinc-900 overflow-hidden">
                {project.thumbnailDataUrl ? (
                    <img
                        src={project.thumbnailDataUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎬</div>
                            <span className="text-zinc-500 text-sm">No Preview</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Section - Compact */}
            <div className="p-3 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-white text-sm truncate" title={project.title}>
                    {project.title}
                </h3>

                {/* Timestamp */}
                <p className="text-xs text-zinc-500">
                    {getRelativeTime(project.createdAt)}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => onEdit(project)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition-colors"
                    >
                        <Pencil size={14} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        onBlur={() => setShowDeleteConfirm(false)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${showDeleteConfirm
                                ? 'bg-red-500 text-white'
                                : 'bg-zinc-700/50 text-zinc-400 hover:bg-red-500/20 hover:text-red-400'
                            }`}
                    >
                        <Trash2 size={14} />
                        {showDeleteConfirm ? 'Confirm?' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};
