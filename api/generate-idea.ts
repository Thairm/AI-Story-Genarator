// Vercel Serverless Function Handler - OpenAI Story Idea Generation
export default async function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { category } = request.body;

        // 1. Get the API Key securely from the server environment
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OPENAI_API_KEY is missing in environment variables");
            return response.status(500).json({ error: "Server Configuration Error: Missing OpenAI API Key" });
        }

        // 2. Build the system prompt
        let systemPrompt = `Generate a unique, viral-worthy story concept for a Reddit-style TikTok video.
The idea should be intriguing, relatable, and have potential for drama or humor.
The concept should be written as if someone is about to tell their story (e.g., "AITA for refusing to pay for my sister's wedding after she uninvited my girlfriend?").
Return ONLY the story concept as a single paragraph (2-3 sentences max).
Do not include any formatting, labels, or quotation marks.`;

        // Add category-specific instructions if provided
        if (category && category !== 'random') {
            const categoryDescriptions = {
                'aita': 'Am I The A**hole (AITA) - moral dilemmas where the narrator questions if they were wrong',
                'horror': 'Horror/Creepy - supernatural, scary, or unsettling experiences',
                'romance': 'Romance/Relationships - love stories, dating mishaps, relationship drama',
                'revenge': 'Revenge/Petty - satisfying payback stories or petty revenge',
                'wholesome': 'Wholesome/Heartwarming - feel-good stories that restore faith in humanity',
                'workplace': 'Workplace Drama - office politics, bad bosses, coworker conflicts',
                'family': 'Family Drama - conflicts with parents, siblings, in-laws, or relatives'
            };

            const categoryDesc = categoryDescriptions[category] || category;
            systemPrompt += `\n\nThe story should fit the "${categoryDesc}" genre.`;
        }

        // 3. Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: 'Generate a creative story idea.'
                    }
                ],
                temperature: 1.0, // Higher temperature for more creative/varied ideas
                max_tokens: 150
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error("OpenAI API Error:", errorData);
            return response.status(500).json({ error: `OpenAI Error: ${errorData.error?.message || 'Unknown OpenAI Error'}` });
        }

        const data = await openaiResponse.json();
        const idea = data.choices?.[0]?.message?.content?.trim() || '';

        // 4. Send the result back to the frontend
        return response.status(200).json({ idea });

    } catch (error) {
        console.error("Backend Generator Error:", error);
        return response.status(500).json({ error: `Server Error: ${error instanceof Error ? error.message : 'Unknown Error'}` });
    }
}
