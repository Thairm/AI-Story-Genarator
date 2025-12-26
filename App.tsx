
import React, { useState, useEffect } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { LandingPage } from './components/LandingPage';
import { DocumentPanel } from './components/DocumentPanel';
import { MyVideosPanel } from './components/MyVideosPanel';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { VideoConfig, GenerationStatus, UserPlan, SavedVideoProject } from './types';
import { Profile, Credits } from './services/supabaseClient';
import { onAuthStateChange, fetchAuthState, getProfile, getCredits } from './services/authService';
import { User } from '@supabase/supabase-js';

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

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  // New State for Video Rendering
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // User plan derived from profile
  const userPlan: UserPlan = profile?.plan === 'pro' ? 'pro' : 'free';

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsAuthLoading(true);
      const authState = await fetchAuthState();
      setUser(authState.user);
      setProfile(authState.profile);
      setCredits(authState.credits);
      setIsAuthLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const [newProfile, newCredits] = await Promise.all([
          getProfile(newUser.id),
          getCredits(newUser.id),
        ]);
        setProfile(newProfile);
        setCredits(newCredits);
      } else {
        setProfile(null);
        setCredits(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Refresh credits after video generation
  const refreshCredits = async () => {
    if (user) {
      const newCredits = await getCredits(user.id);
      setCredits(newCredits);
    }
  };

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
    // If not logged in, show auth modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setView('studio');
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setView('studio');
    window.scrollTo(0, 0);
  };

  const handleSignOut = () => {
    setUser(null);
    setProfile(null);
    setCredits(null);
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage onLaunch={launchStudio} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
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
        {/* Header with User Menu */}
        {profile && credits && (
          <div className="absolute top-4 right-4 z-50">
            <UserMenu
              profile={profile}
              credits={credits}
              onOpenPricing={() => setShowPricingModal(true)}
              onSignOut={handleSignOut}
            />
          </div>
        )}

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
            user={user}
            credits={credits}
            onCreditsUsed={refreshCredits}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* TODO: Add PricingModal here when implemented */}
    </div>
  );
};

export default App;

