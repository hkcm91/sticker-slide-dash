
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Lock, Unlock, Trash2, RotateCw, ChevronUp, ChevronDown, SquareCheck } from 'lucide-react';
import { Slider } from '../ui/slider';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';

interface StickerControlsProps {
  sticker: StickerType;
  isHovered: boolean;
  onDelete?: () => void;
  onRotate?: () => void;
  onOpacityChange?: (opacity: number) => void;
  onToggleLock?: () => void;
  onChangeZIndex?: (change: number) => void;
}

const StickerControls = ({
  sticker,
  isHovered,
  onDelete,
  onRotate,
  onOpacityChange,
  onToggleLock,
  onChangeZIndex
}: StickerControlsProps) => {
  const { toggleSelection, isSelected } = useSelection();
  const { toast } = useToast();
  
  if (!sticker.placed) return null;

  // Show controls when hovered or locked
  const showControls = isHovered || sticker.locked;
  
  if (!showControls) return null;
  
  const handleToggleLock = () => {
    if (onToggleLock) {
      onToggleLock();
      
      // Show feedback toast
      toast({
        title: sticker.locked ? "Sticker unlocked" : "Sticker locked",
        description: sticker.locked ? "The sticker can now be moved." : "The sticker is now locked in place.",
        duration: 2000,
      });
    }
  };
  
  const handleChangeZIndex = (change: number) => {
    if (onChangeZIndex) {
      onChangeZIndex(change);
      
      // Show feedback toast
      toast({
        title: change > 0 ? "Brought forward" : "Sent backward",
        description: `Sticker layer position changed.`,
        duration: 1500,
      });
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Top controls - based on the reference image */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center space-x-1 bg-black/85 backdrop-blur-sm text-white p-2 rounded-t-md pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="p-1.5 hover:bg-white/30 rounded-full transition-colors flex items-center" 
          onClick={() => toggleSelection(sticker.id, false)}
          title={isSelected(sticker.id) ? "Deselect" : "Select"}
        >
          <SquareCheck className={`w-4 h-4 ${isSelected(sticker.id) ? "text-blue-400" : "text-white/70"}`} />
        </button>
        
        {onRotate && (
          <button 
            className="p-1.5 hover:bg-white/30 rounded-full transition-colors" 
            onClick={onRotate}
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
        
        {onToggleLock && (
          <button 
            className="p-1.5 hover:bg-white/30 rounded-full transition-colors" 
            onClick={handleToggleLock}
            title={sticker.locked ? "Unlock" : "Lock"}
          >
            {sticker.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}
        
        {onDelete && (
          <button 
            className="p-1.5 hover:bg-red-500/70 rounded-full transition-colors" 
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Z-index controls - reference image shows vertical controls */}
      {onChangeZIndex && (
        <div 
          className="absolute right-0 top-1/3 flex flex-col space-y-0.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="p-1.5 bg-black/85 hover:bg-black rounded-l-md transition-colors text-white"
            onClick={() => handleChangeZIndex(1)}
            title="Bring forward"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 bg-black/85 hover:bg-black rounded-l-md transition-colors text-white"
            onClick={() => handleChangeZIndex(-1)}
            title="Send backward"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Opacity slider - similar to the reference image */}
      {onOpacityChange && (
        <div 
          className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/85 backdrop-blur-sm p-2 rounded-b-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full px-2">
            <Slider 
              defaultValue={[sticker.opacity || 1]}
              min={0.1}
              max={1}
              step={0.1} 
              onValueChange={(value) => onOpacityChange(value[0])}
              className="h-3"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerControls;
