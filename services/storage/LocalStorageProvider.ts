import { IStorageProvider } from './StorageProvider';
import { VideoConfig, SavedVideoProject } from '../../types';

const STORAGE_KEY = 'storyforge-projects';

export class LocalStorageProvider implements IStorageProvider {
    private generateId(): string {
        return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    private generateTitle(config: VideoConfig): string {
        // Generate title from first sentence of script
        const firstSentence = config.script[0]?.sentences[0]?.text;
        if (firstSentence && firstSentence.length > 0) {
            return firstSentence.substring(0, 30) + (firstSentence.length > 30 ? '...' : '');
        }
        return `Video ${new Date().toLocaleDateString()}`;
    }

    private getStoredProjects(): SavedVideoProject[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private saveToStorage(projects: SavedVideoProject[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            throw new Error('Storage limit exceeded. Please delete some videos to save new ones.');
        }
    }

    async saveProject(config: VideoConfig, title?: string, thumbnailDataUrl?: string): Promise<SavedVideoProject> {
        const now = new Date().toISOString();
        const project: SavedVideoProject = {
            id: this.generateId(),
            title: title || this.generateTitle(config),
            createdAt: now,
            updatedAt: now,
            config: JSON.parse(JSON.stringify(config)), // Deep clone
            thumbnailDataUrl,
            storageType: 'local'
        };

        const projects = this.getStoredProjects();
        projects.unshift(project); // Add to beginning (newest first)
        this.saveToStorage(projects);

        return project;
    }

    async getProjects(): Promise<SavedVideoProject[]> {
        return this.getStoredProjects();
    }

    async getProjectById(id: string): Promise<SavedVideoProject | null> {
        const projects = this.getStoredProjects();
        return projects.find(p => p.id === id) || null;
    }

    async deleteProject(id: string): Promise<void> {
        const projects = this.getStoredProjects();
        const filtered = projects.filter(p => p.id !== id);
        this.saveToStorage(filtered);
    }

    async updateProject(id: string, updates: Partial<SavedVideoProject>): Promise<void> {
        const projects = this.getStoredProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage(projects);
        }
    }
}
