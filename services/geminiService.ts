
import { ScriptSection } from "../types";

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock Generator for fallback when API is unavailable (Localhost) or times out
// This ensures the UI never hangs during development.
const generateMockScript = (prompt: string): ScriptSection[] => {
  return [
    {
      id: generateId(),
      title: "The Hook",
      sentences: [
        { id: generateId(), text: `Let me tell you a crazy story about ${prompt || 'something mysterious'}.`, isLocked: false },
        { id: generateId(), text: "You probably won't believe what happened next.", isLocked: false }
      ]
    },
    {
      id: generateId(),
      title: "The Context",
      sentences: [
        { id: generateId(), text: "It started like any normal day, but then I found the box.", isLocked: false },
        { id: generateId(), text: "I realized I had made a huge mistake opening it.", isLocked: false }
      ]
    },
    {
      id: generateId(),
      title: "The Resolution",
      sentences: [
        { id: generateId(), text: "And that is why you should always double check the details.", isLocked: false }
      ]
    }
  ];
};

export const enhanceStoryPrompt = async (currentPrompt: string): Promise<ScriptSection[]> => {
  if (!currentPrompt.trim()) return [];

  // Safety Timeout: If Backend takes > 8 seconds, fallback to mock.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    // Call the Vercel Backend Function
    // This allows the API Key to remain hidden on the server
    // In Production (Vercel), this hits your actual API.
    // In Local (Vite), this usually 404s, triggering the Mock Fallback below.
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: currentPrompt }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Backend API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        // If response isn't JSON, stick with status code
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.text || '[]';

    // Parse JSON response from AI
    let parsedData = [];
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse AI JSON response", e);
      // Fallback if JSON fails to parse but we got text
      return [{
        id: generateId(),
        title: "Script",
        sentences: [{ id: generateId(), text: text, isLocked: false }]
      }];
    }

    // Validate format
    if (!Array.isArray(parsedData)) throw new Error("Invalid script format received");

    // Transform into internal structure
    return parsedData.map((section: any) => ({
      id: generateId(),
      title: section.title || 'Section',
      sentences: (section.sentences || []).map((s: string) => ({
        id: generateId(),
        text: s,
        isLocked: false
      }))
    }));

  } catch (error) {
    console.warn("Backend Unreachable (Switching to Offline Mock).", error);

    // DEBUG: Alert the user so they know why it's failing
    alert(`API Error: ${error instanceof Error ? error.message : 'Unknown Error'}. Using mock data.`);

    // Simulate a small delay for "thinking" feel in offline mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateMockScript(currentPrompt);

  } finally {
    clearTimeout(timeoutId);
  }
};
