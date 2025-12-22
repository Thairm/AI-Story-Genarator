import React, { useState, useEffect } from 'react';
import { SavedVideoProject, UserPlan } from '../types';
import { VideoCard } from './VideoCard';
import { localStorageProvider } from '../services/storage/videoHistoryService';
import { Film, Sparkles } from 'lucide-react';

interface MyVideosPanelProps {
    userPlan: UserPlan;
    onRestoreProject: (project: SavedVideoProject) => void;
}

export const MyVideosPanel: React.FC<MyVideosPanelProps> = ({ userPlan, onRestoreProject }) => {
    const [projects, setProjects] = useState<SavedVideoProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            // For now, always use localStorage (free tier)
            const loadedProjects = await localStorageProvider.getProjects();
            setProjects(loadedProjects);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [userPlan]);

    const handleEdit = (project: SavedVideoProject) => {
        onRestoreProject(project);
    };

    const handleDelete = async (projectId: string) => {
        try {
            await localStorageProvider.deleteProject(projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete project');
        }
    };

    // Empty State
    if (!loading && projects.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
                    <Film size={48} className="text-zinc-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Videos Yet</h2>
                <p className="text-zinc-400 max-w-md">
                    Your generated videos will appear here. Go to "AI Reddit Story" to create your first video!
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-zinc-900">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Film className="text-orange-500" />
                            My Videos
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            {projects.length} video{projects.length !== 1 ? 's' : ''} saved
                            {userPlan === 'free' && ' (stored locally)'}
                        </p>
                    </div>

                    {/* Upgrade Banner for Free Users */}
                    {userPlan === 'free' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg">
                            <Sparkles size={16} className="text-orange-400" />
                            <span className="text-sm text-orange-300">
                                Upgrade to Pro for cloud sync
                            </span>
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    /* Video Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {projects.map(project => (
                            <VideoCard
                                key={project.id}
                                project={project}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
