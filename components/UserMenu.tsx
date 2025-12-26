import React, { useState, useRef, useEffect } from 'react';
import { Profile, Credits } from '../services/supabaseClient';
import { signOut } from '../services/authService';

interface UserMenuProps {
    profile: Profile;
    credits: Credits;
    onOpenPricing: () => void;
    onSignOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ profile, credits, onOpenPricing, onSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            onSignOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const totalCredits = credits.paid_credits + credits.free_credits;
    const planColors = {
        free: '#6b7280',
        starter: '#f97316',
        pro: '#8b5cf6',
    };

    return (
        <div className="user-menu" ref={menuRef}>
            <button className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="user-avatar">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.display_name || 'User'} />
                    ) : (
                        <span>{(profile.display_name || profile.email || 'U')[0].toUpperCase()}</span>
                    )}
                </div>
                <div className="user-info">
                    <span className="user-name">{profile.display_name || profile.email?.split('@')[0]}</span>
                    <span className="user-plan" style={{ color: planColors[profile.plan] }}>
                        {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
                    </span>
                </div>
                <svg
                    className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div className="user-menu-dropdown">
                    {/* Credits Section */}
                    <div className="menu-section">
                        <div className="menu-credits">
                            <div className="credits-label">Credits</div>
                            <div className="credits-value">{totalCredits.toLocaleString()}</div>
                        </div>
                        <div className="credits-breakdown">
                            <span>Paid: {credits.paid_credits}</span>
                            <span>Free: {credits.free_credits}</span>
                        </div>
                        {profile.plan !== 'free' && (
                            <div className="redo-count">
                                Audio Redos: {credits.audio_redos_used} / {credits.audio_redo_limit === 0 ? '∞' : credits.audio_redo_limit}
                            </div>
                        )}
                    </div>

                    <div className="menu-divider" />

                    {/* Actions */}
                    {profile.plan === 'free' && (
                        <button className="menu-item upgrade-btn" onClick={() => { onOpenPricing(); setIsOpen(false); }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            Upgrade Plan
                        </button>
                    )}

                    {profile.plan !== 'free' && (
                        <button className="menu-item" onClick={() => { /* TODO: Open Stripe Portal */ setIsOpen(false); }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <path d="M3 10h18" />
                            </svg>
                            Manage Subscription
                        </button>
                    )}

                    <div className="menu-divider" />

                    <button className="menu-item signout-btn" onClick={handleSignOut}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            )}

            <style>{`
        .user-menu {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .user-menu-trigger:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-avatar span {
          color: #fff;
          font-weight: 600;
          font-size: 16px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .user-name {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .user-plan {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .dropdown-arrow {
          color: #888;
          transition: transform 0.2s;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 240px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          z-index: 100;
        }

        .menu-section {
          padding: 12px;
        }

        .menu-credits {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .credits-label {
          color: #888;
          font-size: 13px;
        }

        .credits-value {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .credits-breakdown {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #666;
        }

        .redo-count {
          margin-top: 8px;
          font-size: 12px;
          color: #888;
        }

        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 4px 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          color: #ccc;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          text-align: left;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .menu-item.upgrade-btn {
          color: #f97316;
        }

        .menu-item.upgrade-btn:hover {
          background: rgba(249, 115, 22, 0.1);
        }

        .menu-item.signout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }
      `}</style>
        </div>
    );
};

export default UserMenu;
