// Story Idea Generation Service

export interface StoryCategory {
    id: string;
    name: string;
    description: string;
}

export const STORY_CATEGORIES: StoryCategory[] = [
    { id: 'random', name: 'Random', description: 'Any genre' },
    { id: 'aita', name: 'AITA', description: 'Am I The A**hole' },
    { id: 'horror', name: 'Horror', description: 'Scary & Creepy' },
    { id: 'romance', name: 'Romance', description: 'Love & Relationships' },
    { id: 'revenge', name: 'Revenge', description: 'Petty & Satisfying' },
    { id: 'wholesome', name: 'Wholesome', description: 'Heartwarming' },
    { id: 'workplace', name: 'Workplace', description: 'Office Drama' },
    { id: 'family', name: 'Family', description: 'Family Conflicts' },
];

export const generateStoryIdea = async (category?: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate-idea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: category || 'random' }),
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) errorMessage = errorData.error;
            } catch (e) {
                // If response isn't JSON, stick with status code
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.idea || '';
    } catch (error) {
        console.error('Failed to generate story idea:', error);
        throw error;
    }
};
