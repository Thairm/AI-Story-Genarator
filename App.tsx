
import React, { useState } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { LandingPage } from './components/LandingPage';
import { DocumentPanel } from './components/DocumentPanel';
import { MyVideosPanel } from './components/MyVideosPanel';
import { VideoConfig, GenerationStatus, UserPlan, SavedVideoProject } from './types';

const INITIAL_CONFIG: VideoConfig = {
  prompt: '',
  script: [
    {
      id: 'default-hook',
      title: 'Section 1',
      sentences: [{ id: 'def-h-1', text: '', isLocked: false }]
    },
    {
      id: 'default-context',
      title: 'Section 2',
      sentences: [{ id: 'def-c-1', text: '', isLocked: false }]
    },
    {
      id: 'default-resolution',
      title: 'Section 3',
      sentences: [{ id: 'def-r-1', text: '', isLocked: false }]
    }
  ],
  narratorId: 'adam',
  captionAnimationId: 'popup',
  captionThemeId: 'hormozi',
  captionFontId: 'bold', // Default Font
  captionY: 50, // Center Y
  captionX: 50, // Center X
  captionScale: 1.0, // Default size
  backgroundId: 'minecraft'
};

type ViewMode = 'landing' | 'studio';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [activeTab, setActiveTab] = useState<TabId>('reddit-story');
  const [config, setConfig] = useState<VideoConfig>(INITIAL_CONFIG);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [userPlan] = useState<UserPlan>('free'); // Default to free, can be updated when auth is added

  // New State for Video Rendering
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleGenerate = () => {
    // This is now handled inside ConfigPanel's handleGenerateVideo
    // But we keep this stub if needed for other triggers
  };

  // Handler to restore a project from My Videos
  const handleRestoreProject = (project: SavedVideoProject) => {
    setConfig(project.config);
    setActiveTab('reddit-story');
    setStatus(GenerationStatus.IDLE);
    setVideoUrl(null);
    setProgress(0);
  };

  const launchStudio = () => {
    setView('studio');
    window.scrollTo(0, 0);
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={launchStudio} />;
  }

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100 overflow-hidden font-sans">
      {/* Column 1: Sidebar */}
      <Sidebar
        onLogoClick={() => setView('landing')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Column 2: Configuration */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {activeTab === 'reddit-story' && (
          <ConfigPanel
            config={config}
            status={status}
            onConfigChange={setConfig}
            onGenerate={handleGenerate}
            setStatus={setStatus}
            setVideoUrl={setVideoUrl}
            setProgress={setProgress}
            progress={progress}
          />
        )}
        {activeTab === 'document' && (
          <DocumentPanel />
        )}
        {activeTab === 'my-videos' && (
          <MyVideosPanel
            userPlan={userPlan}
            onRestoreProject={handleRestoreProject}
          />
        )}
        {/* Placeholders for other tabs */}
        {activeTab !== 'reddit-story' && activeTab !== 'document' && activeTab !== 'my-videos' && (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            <p>{activeTab} Content Coming Soon</p>
          </div>
        )}
      </main>

      {/* Column 3: Preview */}
      {activeTab === 'reddit-story' && (
        <PreviewPanel
          config={config}
          onConfigChange={setConfig}
          status={status}
          videoUrl={videoUrl}
          progress={progress}
        />
      )}
    </div>
  );
};

export default App;
