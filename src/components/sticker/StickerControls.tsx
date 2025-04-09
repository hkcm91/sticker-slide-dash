
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Lock, Unlock, Trash2, RotateCw, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from '../ui/slider';

interface StickerControlsProps {
  sticker: StickerType;
  isHovered: boolean;
  onDelete?: () => void;
  onRotate?: () => void;
  onOpacityChange?: (opacity: number) => void;
  onToggleLock?: () => void;
  onToggleVisibility?: () => void;
  onChangeZIndex?: (change: number) => void;
}

const StickerControls = ({
  sticker,
  isHovered,
  onDelete,
  onRotate,
  onOpacityChange,
  onToggleLock,
  onToggleVisibility,
  onChangeZIndex
}: StickerControlsProps) => {
  if (!sticker.placed || (sticker.visible === false && !isHovered)) return null;

  // Include controls even if not hovered when locked or invisible
  const showControls = isHovered || sticker.locked || sticker.visible === false;
  
  if (!showControls) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Top controls - centered and overlapping the sticker for better accessibility */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center space-x-1 bg-black/60 backdrop-blur-sm text-white p-1 rounded-md pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {onRotate && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onRotate}
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
        
        {onToggleLock && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onToggleLock}
            title={sticker.locked ? "Unlock" : "Lock"}
          >
            {sticker.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}
        
        {onToggleVisibility && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onToggleVisibility}
            title={sticker.visible === false ? "Show" : "Hide"}
          >
            {sticker.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {onDelete && (
          <button 
            className="p-1 hover:bg-red-400/50 rounded-full transition-colors" 
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Z-index controls - right side */}
      {onChangeZIndex && (
        <div 
          className="absolute right-0 top-1/4 bottom-1/4 flex flex-col justify-center space-y-1 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="p-1 bg-black/60 hover:bg-black/80 rounded-l-md transition-colors text-white"
            onClick={() => onChangeZIndex(1)}
            title="Bring forward"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            className="p-1 bg-black/60 hover:bg-black/80 rounded-l-md transition-colors text-white"
            onClick={() => onChangeZIndex(-1)}
            title="Send backward"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Opacity slider - bottom of sticker */}
      {onOpacityChange && (
        <div 
          className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/60 backdrop-blur-sm p-1 rounded-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full px-2">
            <Slider 
              defaultValue={[sticker.opacity || 1]}
              min={0.1}
              max={1}
              step={0.1} 
              onValueChange={(value) => onOpacityChange(value[0])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerControls;
