
import { VideoConfig, ScriptSentence, ImageStyle } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY || '';

export const generateImageForScene = async (
    sentence: ScriptSentence,
    style: ImageStyle,
    storyContext: string
): Promise<string> => {
    // If no API Key, return a mock image (Unsplash based on keywords if possible, or just a placeholder)
    if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('PLACEHOLDER')) {
        console.warn("No OpenAI API Key found. Returning mock image.");
        // Return a random horror-themed unsplash image based on style
        const keywords = style.id === 'realistic_horror' ? 'horror,dark' : 'scary,spooky';
        return `https://source.unsplash.com/random/1080x1920/?${keywords}&sig=${Math.random()}`;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `A 9:16 vertical horror scene. ${style.promptModifier}. SCENE DESCRIPTION: ${sentence.text}. CONTEXT: ${storyContext}. Ensure the image is scary, atmospheric, and high quality.`,
                n: 1,
                size: "1024x1792", // DALL-E 3 Vertical
                quality: "standard",
                response_format: "url"
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate image');
        }

        const data = await response.json();
        return data.data[0].url;

    } catch (error) {
        console.error("Image Generation Failed:", error);
        // Fallback to mock on error to keep UI working
        return `https://placehold.co/1080x1920/1a1a1a/FFF?text=Generation+Failed`;
    }
};
