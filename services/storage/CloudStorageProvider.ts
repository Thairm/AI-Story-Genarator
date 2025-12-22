import { IStorageProvider } from './StorageProvider';
import { VideoConfig, SavedVideoProject } from '../../types';

/**
 * CloudStorageProvider - Placeholder for Paid Tier
 * 
 * This will be implemented when you set up:
 * - Firebase Firestore + Storage, OR
 * - Supabase, OR
 * - Custom backend API
 */
export class CloudStorageProvider implements IStorageProvider {
    private userId: string | undefined;

    constructor(userId?: string) {
        this.userId = userId;
    }

    async saveProject(_config: VideoConfig, _title?: string, _thumbnailDataUrl?: string): Promise<SavedVideoProject> {
        throw new Error('Cloud storage not yet configured. Please set up Firebase or Supabase.');
    }

    async getProjects(): Promise<SavedVideoProject[]> {
        throw new Error('Cloud storage not yet configured. Please set up Firebase or Supabase.');
    }

    async getProjectById(_id: string): Promise<SavedVideoProject | null> {
        throw new Error('Cloud storage not yet configured. Please set up Firebase or Supabase.');
    }

    async deleteProject(_id: string): Promise<void> {
        throw new Error('Cloud storage not yet configured. Please set up Firebase or Supabase.');
    }

    async updateProject(_id: string, _updates: Partial<SavedVideoProject>): Promise<void> {
        throw new Error('Cloud storage not yet configured. Please set up Firebase or Supabase.');
    }
}
