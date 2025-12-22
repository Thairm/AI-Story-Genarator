import React, { useState, useEffect } from 'react';
import { Settings, X, RotateCcw, Save } from 'lucide-react';
import { DEFAULT_SYSTEM_PROMPT } from '../types';

interface SystemPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPrompt: string;
    onSave: (prompt: string) => void;
}

const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
    isOpen,
    onClose,
    currentPrompt,
    onSave,
}) => {
    const [editedPrompt, setEditedPrompt] = useState(currentPrompt);

    // Sync with external changes when modal opens
    useEffect(() => {
        if (isOpen) {
            setEditedPrompt(currentPrompt);
        }
    }, [isOpen, currentPrompt]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(editedPrompt);
        onClose();
    };

    const handleReset = () => {
        setEditedPrompt(DEFAULT_SYSTEM_PROMPT);
    };

    const handleCancel = () => {
        setEditedPrompt(currentPrompt); // Revert changes
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-orange-400" />
                        <h2 className="text-lg font-semibold text-white">AI System Prompt</h2>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
                    <p className="text-sm text-gray-400">
                        Customize how the AI writes your stories. Change the perspective, tone, length, or style.
                    </p>
                    <textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="flex-1 w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[300px]"
                        placeholder="Enter your custom system prompt..."
                    />
                    <p className="text-xs text-gray-500">
                        Note: The JSON format instructions are automatically added to ensure the app works correctly.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-gray-700">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset to Default
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemPromptModal;
