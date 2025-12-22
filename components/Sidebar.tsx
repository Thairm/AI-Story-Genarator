
import React from 'react';
import { LayoutTemplate, PlusCircle, FileVideo, Mic2, Settings, User, Image, FileText } from 'lucide-react';

export type TabId = 'reddit-story' | 'image-story' | 'my-videos' | 'voice-library' | 'settings' | 'document';

interface SidebarProps {
  onLogoClick: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogoClick, activeTab, onTabChange }) => {
  return (
    <aside className="w-20 lg:w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Logo Area */}
        <button
          onClick={onLogoClick}
          className="w-full h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 font-bold text-lg text-white hidden lg:block">StoryForge</span>
        </button>

        {/* Navigation */}
        <nav className="mt-6 px-2 lg:px-4 space-y-2">
          <NavItem
            icon={<PlusCircle size={20} />}
            label="AI Reddit Story"
            active={activeTab === 'reddit-story'}
            onClick={() => onTabChange('reddit-story')}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Document"
            active={activeTab === 'document'}
            onClick={() => onTabChange('document')}
          />
          <NavItem
            icon={<Image size={20} />}
            label="AI Story with image"
            active={activeTab === 'image-story'}
            onClick={() => onTabChange('image-story')}
          />
          <NavItem
            icon={<FileVideo size={20} />}
            label="My Videos"
            active={activeTab === 'my-videos'}
            onClick={() => onTabChange('my-videos')}
          />
          <NavItem
            icon={<Mic2 size={20} />}
            label="Voice Library"
            active={activeTab === 'voice-library'}
            onClick={() => onTabChange('voice-library')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => onTabChange('settings')}
          />
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-zinc-900 transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User size={16} className="text-zinc-400" />
          </div>
          <div className="ml-3 hidden lg:block text-left">
            <p className="text-sm font-medium text-white">Alex Creator</p>
            <p className="text-xs text-zinc-500">Pro Plan</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-lg transition-all group ${active
          ? 'bg-amber-500/10 text-orange-400 ring-1 ring-amber-500/50'
          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
        }`}
    >
      <span className={`${active ? 'text-orange-400' : 'group-hover:text-white'}`}>{icon}</span>
      <span className="ml-3 font-medium hidden lg:block">{label}</span>
    </button>
  );
};
