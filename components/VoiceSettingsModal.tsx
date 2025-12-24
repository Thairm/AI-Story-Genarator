import React, { useState, useEffect } from 'react';
import { Menu, X, RotateCcw, Save } from 'lucide-react';
import { VoiceSettings, DEFAULT_VOICE_SETTINGS } from '../types';

interface VoiceSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: VoiceSettings;
    onSave: (settings: VoiceSettings) => void;
}

const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
    isOpen,
    onClose,
    currentSettings,
    onSave,
}) => {
    const [settings, setSettings] = useState<VoiceSettings>(currentSettings);

    // Sync with external changes when modal opens
    useEffect(() => {
        if (isOpen) {
            setSettings(currentSettings);
        }
    }, [isOpen, currentSettings]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(settings);
        onClose();
    };

    const handleReset = () => {
        setSettings(DEFAULT_VOICE_SETTINGS);
    };

    const handleCancel = () => {
        setSettings(currentSettings);
        onClose();
    };

    const updateSetting = <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Menu className="w-5 h-5 text-orange-400" />
                        <h2 className="text-lg font-semibold text-white">Voice Settings</h2>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <p className="text-sm text-gray-400">
                        Adjust how the AI generates voice audio. These settings affect all narrators.
                    </p>

                    {/* Stability Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-white">Stability</label>
                            <span className="text-sm text-orange-400 font-mono">{settings.stability.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.stability}
                            onChange={(e) => updateSetting('stability', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Expressive</span>
                            <span>Consistent</span>
                        </div>
                    </div>

                    {/* Similarity Boost Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-white">Similarity</label>
                            <span className="text-sm text-orange-400 font-mono">{settings.similarityBoost.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.similarityBoost}
                            onChange={(e) => updateSetting('similarityBoost', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Creative</span>
                            <span>Faithful</span>
                        </div>
                    </div>

                    {/* Speed Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-white">Speed</label>
                            <span className="text-sm text-orange-400 font-mono">{settings.speed.toFixed(2)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.7"
                            max="1.2"
                            step="0.01"
                            value={settings.speed}
                            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Slower (0.7x)</span>
                            <span>Faster (1.2x)</span>
                        </div>
                    </div>

                    {/* Style Exaggeration Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-white">Style Exaggeration</label>
                            <span className="text-sm text-orange-400 font-mono">{settings.style.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.style}
                            onChange={(e) => updateSetting('style', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Natural</span>
                            <span>Dramatic</span>
                        </div>
                    </div>

                    {/* Speaker Boost Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                            <label className="text-sm font-medium text-white">Speaker Boost</label>
                            <p className="text-xs text-gray-500 mt-1">Improves number/unit reading (slower)</p>
                        </div>
                        <button
                            onClick={() => updateSetting('useSpeakerBoost', !settings.useSpeakerBoost)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.useSpeakerBoost ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.useSpeakerBoost ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
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
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceSettingsModal;
