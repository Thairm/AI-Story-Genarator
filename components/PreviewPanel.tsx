
import React, { useRef, useState, useEffect } from 'react';
import { VideoConfig, GenerationStatus } from '../types';
import { BACKGROUNDS, CAPTION_THEMES, CAPTION_FONTS } from '../constants';
import { Download, Move, Scaling, AlignCenterHorizontal } from 'lucide-react';

interface PreviewPanelProps {
  config: VideoConfig;
  status: GenerationStatus;
  videoUrl: string | null;
  progress: number;
  onConfigChange: (newConfig: VideoConfig) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ config, status, videoUrl, progress, onConfigChange }) => {
  const selectedBg = BACKGROUNDS.find(b => b.id === config.backgroundId);
  const isLoading = status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETED && status !== GenerationStatus.ERROR;
  const isCompleted = status === GenerationStatus.COMPLETED && videoUrl;

  const theme = CAPTION_THEMES.find(t => t.id === config.captionThemeId) || CAPTION_THEMES[0];
  const font = CAPTION_FONTS.find(f => f.id === config.captionFontId) || CAPTION_FONTS[0];

  // Dragging & Resizing State
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Snap State
  const [snapX, setSnapX] = useState(false);
  const [snapY, setSnapY] = useState(false);

  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const startScaleRef = useRef(1.0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted || isLoading) return;
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted || isLoading) return;
    e.stopPropagation();
    setIsResizing(true);

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startYRef.current = clientY;
    startXRef.current = clientX;
    startScaleRef.current = config.captionScale;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if ((!isDragging && !isResizing) || !containerRef.current) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // --- RESIZING LOGIC ---
    if (isResizing) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaY = clientY - startYRef.current;
      const deltaX = clientX - startXRef.current;

      // Use diagonal distance for uniform scaling
      // Positive when dragging down-right, negative when dragging up-left
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const sign = (deltaX + deltaY) >= 0 ? 1 : -1;

      // Sensitivity: 150px diagonal drag = 1.0 scale change
      const scaleDelta = (sign * distance) / 150;
      const newScale = Math.max(0.5, Math.min(3.0, startScaleRef.current + scaleDelta));

      onConfigChange({ ...config, captionScale: newScale });
      return;
    }

    // --- DRAGGING LOGIC ---
    if (isDragging) {
      const container = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

      let relativeY = clientY - container.top;
      let relativeX = clientX - container.left;

      // Clamp values
      relativeY = Math.max(0, Math.min(relativeY, container.height));
      relativeX = Math.max(0, Math.min(relativeX, container.width));

      // Convert to percentage
      let percentY = Math.round((relativeY / container.height) * 100);
      let percentX = Math.round((relativeX / container.width) * 100);

      // Snapping Logic X (Center Width)
      if (Math.abs(percentX - 50) < 5) {
        percentX = 50;
        setSnapX(true);
      } else {
        setSnapX(false);
      }

      // Snapping Logic Y (Center Height)
      if (Math.abs(percentY - 50) < 5) {
        percentY = 50;
        setSnapY(true);
      } else {
        setSnapY(false);
      }

      onConfigChange({ ...config, captionY: percentY, captionX: percentX });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setSnapX(false);
    setSnapY(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing]);

  // Determine Font Family for Preview
  const getFontFamily = () => {
    if (font.family === 'Bangers') return '"Bangers", cursive';
    if (font.family === 'RobotoMono') return '"Roboto Mono", monospace';
    return '"Inter", sans-serif';
  };

  const captionStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${config.captionY}%`,
    left: `${config.captionX}%`,
    // Combine translate (for centering) with scale (for resizing)
    transform: `translate(-50%, -50%) scale(${config.captionScale})`,
    fontFamily: getFontFamily(),
    fontWeight: font.family === 'Bangers' ? '400' : '900',
    color: theme.primaryColor,
    textShadow: theme.isNeon
      ? `0 0 10px ${theme.secondaryColor}, 0 0 20px ${theme.secondaryColor}`
      : `2px 2px 0px ${theme.secondaryColor}, -1px -1px 0 #000`,
    textAlign: 'center',
    cursor: isCompleted ? 'default' : 'grab',
    zIndex: 30,
    width: 'auto',
    whiteSpace: 'nowrap',
    lineHeight: 1.2
  };

  return (
    <aside className="hidden xl:flex w-96 h-full bg-zinc-950 border-l border-zinc-800 flex-col items-center justify-center p-8 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

      <div className="mb-6 text-center">
        <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wider">Preview</h3>
      </div>

      {/* Phone Mockup Container */}
      <div ref={containerRef} className="relative w-[300px] h-[533px] bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-zinc-700/50 select-none group/phone">

        {/* Screen Content */}
        <div className="absolute inset-0 bg-black flex flex-col">

          {/* Snap Lines */}
          {snapX && (
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-500/80 z-40 transform -translate-x-1/2 pointer-events-none shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          )}
          {snapY && (
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-amber-500/80 z-40 transform -translate-y-1/2 pointer-events-none shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          )}

          {/* Snap Label */}
          {(snapX || snapY) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded z-50 pointer-events-none">
              CENTER
            </div>
          )}

          {/* Header Status Bar (Mock) */}
          <div className="h-8 w-full flex justify-between items-center px-6 pt-2 z-20 pointer-events-none">
            <div className="text-[10px] font-bold text-white shadow-black drop-shadow-md">9:41</div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-white rounded-full opacity-50 shadow-black drop-shadow-md"></div>
              <div className="w-3 h-3 bg-white rounded-full opacity-50 shadow-black drop-shadow-md"></div>
            </div>
          </div>

          {/* Video Preview Layer */}
          <div className="absolute inset-0 z-0 bg-zinc-950">
            {isCompleted && videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {selectedBg && (
                  <div className="relative w-full h-full pointer-events-none">
                    <img
                      src={selectedBg.thumbnail}
                      alt="Preview"
                      className={`w-full h-full object-cover transition-all duration-700 ${isLoading ? 'scale-105 blur-sm brightness-50' : 'brightness-75'}`}
                    />
                    {/* Overlay Gradient for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Interactive Caption Overlay */}
          {!isCompleted && !isLoading && (
            <div
              style={captionStyle}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className={`group/text hover:ring-1 hover:ring-amber-500/50 rounded-lg p-2 transition-transform select-none ${isDragging ? 'cursor-grabbing' : ''}`}
            >
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg inline-block relative shadow-xl">
                <span className="text-yellow-400 font-extrabold text-xl leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  Drag to Move<br />Resize corner
                </span>

                {/* Resize Handle */}
                <div
                  onMouseDown={handleResizeStart}
                  onTouchStart={handleResizeStart}
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-amber-500 cursor-nwse-resize flex items-center justify-center opacity-0 group-hover/text:opacity-100 transition-opacity z-50 hover:scale-125"
                >
                  <Scaling size={12} className="text-orange-500" />
                </div>
              </div>

              {/* Tooltip on Hover */}
              {!isDragging && !isResizing && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/text:opacity-100 transition-opacity bg-zinc-800/90 text-[10px] text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none shadow-xl border border-zinc-700">
                  <Move className="w-3 h-3 inline mr-1" />
                  Drag & Drop
                </div>
              )}
            </div>
          )}

          {/* Loading / Status Overlay */}
          {!isCompleted && isLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center px-6 pointer-events-none bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-block w-16 h-16 relative mb-4">
                  <svg className="animate-spin w-full h-full text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    {progress}%
                  </div>
                </div>
                <p className="text-white font-bold animate-pulse shadow-black drop-shadow-md">
                  {status === GenerationStatus.GENERATING_SCRIPT ? 'AI Writing...' : 'Rendering...'}
                </p>
              </div>
            </div>
          )}

          {/* TikTok-style UI overlay (Only show if not playing result) */}
          {!isCompleted && (
            <div className="absolute right-2 bottom-20 flex flex-col space-y-4 z-20 items-center pointer-events-none">
              <div className="w-10 h-10 bg-zinc-800/80 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm opacity-50"></div>
              </div>
              <div className="w-10 h-10 bg-zinc-800/80 rounded-full opacity-50"></div>
              <div className="w-10 h-10 bg-zinc-800/80 rounded-full opacity-50"></div>
            </div>
          )}

          {!isCompleted && (
            <div className="absolute bottom-4 left-4 right-16 z-20 pointer-events-none">
              <div className="h-2 w-24 bg-zinc-700/80 rounded mb-2"></div>
              <div className="h-2 w-32 bg-zinc-700/80 rounded"></div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Info / Download */}
      <div className="mt-8 w-full px-6">
        {isCompleted && videoUrl ? (
          <a
            href={videoUrl}
            download="storyforge-viral.mp4"
            className="flex items-center justify-center w-full bg-orange-500 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-900/20"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Video
          </a>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-white font-medium">~58s</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Resolution</p>
              <p className="text-white font-medium">1080x1920</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
