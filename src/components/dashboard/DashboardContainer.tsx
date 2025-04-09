
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sticker as StickerType } from '@/types/stickers';
import PlacedStickers from './PlacedStickers';
import DashboardHint from './DashboardHint';
import { Sparkles } from 'lucide-react';
import DockedWidgets from './DockedWidgets';

interface DashboardContainerProps {
  background: string | null;
  showHint: boolean;
  hasSeenHint: boolean;
  placedStickers: StickerType[];
  dockedStickers?: StickerType[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
  onStickerUpdate: (sticker: StickerType) => void;
  onUndockWidget?: (sticker: StickerType) => void;
  onCloseDockedWidget?: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  children?: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  background,
  showHint,
  hasSeenHint,
  placedStickers,
  dockedStickers = [],
  onDragOver,
  onDrop,
  onDragStart,
  onStickerClick,
  onStickerDelete,
  onStickerUpdate,
  onUndockWidget,
  onCloseDockedWidget,
  onToggleLock,
  onChangeZIndex,
  children
}) => {
  const { theme } = useTheme();

  const getBackgroundStyle = () => {
    if (background && theme.backgroundStyle === 'image') {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (theme.backgroundStyle === 'gradient') {
      const { startColor, endColor, direction } = theme.gradientOptions;
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`
      };
    }
    
    return {
      backgroundColor: theme.backgroundColor
    };
  };

  return (
    <div 
      className="flex-1 relative overflow-hidden transition-all duration-300"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={getBackgroundStyle()}
    >
      <div 
        className={`absolute inset-0 ${
          background && theme.backgroundStyle === 'image' ? 'bg-black/10' : 
          theme.mode === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ opacity: theme.backgroundOpacity }}
      >
        {showHint && !hasSeenHint && (
          <DashboardHint />
        )}
        
        <div className="p-6">
          {placedStickers.length === 0 && dockedStickers.length === 0 && (
            <div className="h-full flex items-center justify-center opacity-40">
              <div className="text-center text-gray-400">
                <Sparkles className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                <p className="text-sm mt-2">Add stickers to your dashboard by dragging them here</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 h-full">
            <PlacedStickers 
              stickers={placedStickers}
              onDragStart={onDragStart}
              onStickerClick={onStickerClick}
              onStickerDelete={onStickerDelete}
              onStickerUpdate={onStickerUpdate}
              onToggleLock={onToggleLock}
              onChangeZIndex={onChangeZIndex}
            />
          </div>
        </div>
      </div>
      
      {/* Render the children (for selection overlay) */}
      {children}
      
      {/* Docked widgets area */}
      {dockedStickers.length > 0 && onUndockWidget && onCloseDockedWidget && (
        <DockedWidgets 
          dockedWidgets={dockedStickers} 
          onUndockWidget={onUndockWidget}
          onCloseWidget={onCloseDockedWidget}
        />
      )}
    </div>
  );
};

export default DashboardContainer;
