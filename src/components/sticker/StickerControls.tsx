
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Lock, Unlock, Trash2, RotateCw, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from '../ui/slider';

interface StickerControlsProps {
  sticker: StickerType;
  isHovered: boolean;
  onDelete?: () => void;
  onRotate?: (e: React.MouseEvent) => void;
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
  if (!sticker.placed || !isHovered) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className="absolute -top-8 left-0 right-0 flex justify-center space-x-1 bg-black/30 backdrop-blur-sm text-white p-1 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        {onRotate && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onRotate}
            title="Rotate"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        )}
        
        {onToggleLock && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onToggleLock}
            title={sticker.locked ? "Unlock" : "Lock"}
          >
            {sticker.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
        )}
        
        {onToggleVisibility && (
          <button 
            className="p-1 hover:bg-white/20 rounded-full transition-colors" 
            onClick={onToggleVisibility}
            title={sticker.visible === false ? "Show" : "Hide"}
          >
            {sticker.visible === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        )}
        
        {onDelete && (
          <button 
            className="p-1 hover:bg-red-400/50 rounded-full transition-colors" 
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {onChangeZIndex && (
        <div 
          className="absolute -right-8 top-0 bottom-0 flex flex-col justify-center space-y-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            onClick={() => onChangeZIndex(1)}
            title="Bring forward"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button 
            className="p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            onClick={() => onChangeZIndex(-1)}
            title="Send backward"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {onOpacityChange && (
        <div 
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 bg-black/30 backdrop-blur-sm p-2 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Slider 
            defaultValue={[sticker.opacity || 1]}
            min={0.1}
            max={1}
            step={0.1} 
            onValueChange={(value) => onOpacityChange(value[0])}
          />
        </div>
      )}
    </div>
  );
};

export default StickerControls;
