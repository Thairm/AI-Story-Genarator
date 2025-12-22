import { VideoConfig, SavedVideoProject } from '../../types';

export interface IStorageProvider {
    saveProject(config: VideoConfig, title?: string, thumbnailDataUrl?: string): Promise<SavedVideoProject>;
    getProjects(): Promise<SavedVideoProject[]>;
    getProjectById(id: string): Promise<SavedVideoProject | null>;
    deleteProject(id: string): Promise<void>;
    updateProject(id: string, updates: Partial<SavedVideoProject>): Promise<void>;
}
