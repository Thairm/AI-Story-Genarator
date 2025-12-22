import { UserContext } from '../../types';
import { IStorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { CloudStorageProvider } from './CloudStorageProvider';

/**
 * Get the appropriate storage provider based on user's plan
 */
export function getStorageProvider(user: UserContext): IStorageProvider {
    if (user.plan === 'pro') {
        return new CloudStorageProvider(user.userId);
    }
    return new LocalStorageProvider();
}

// Export a default instance for free tier (most common use case)
export const localStorageProvider = new LocalStorageProvider();
