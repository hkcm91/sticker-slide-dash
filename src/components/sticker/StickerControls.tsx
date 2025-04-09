
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { ArrowLeftCircle, RotateCw, Eye, Layers, Lock, Unlock } from 'lucide-react';

interface StickerControlsProps {
  sticker: StickerType;
  isHovered: boolean;
  onDelete?: (sticker: StickerType) => void;
  onRotate: (e: React.MouseEvent) => void;
  onOpacityChange?: (opacity: number) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
  onChangeZIndex?: (change: number) => void;
}

const StickerControls: React.FC<StickerControlsProps> = ({ 
  sticker, 
  isHovered, 
  onDelete,
  onRotate,
  onOpacityChange,
  onToggleLock,
  onToggleVisibility,
  onChangeZIndex
}) => {
  if (!sticker.placed || !isHovered) {
    return null;
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(sticker);
    }
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLock) {
      onToggleLock(sticker);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(sticker);
    }
  };

  const handleChangeZIndex = (change: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChangeZIndex) {
      onChangeZIndex(change);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute -top-2 -left-2 right-2 flex gap-1 justify-between">
        {/* Top left controls */}
        {onDelete && (
          <div 
            className="bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
            onClick={handleDelete}
            title="Return to tray"
          >
            <ArrowLeftCircle size={12} />
          </div>
        )}
        
        {/* Top right controls - optional */}
        <div className="flex gap-1">
          {onToggleLock && (
            <div 
              className="bg-amber-500 text-white rounded-full p-1 cursor-pointer hover:bg-amber-600 transition-colors z-20 shadow-md"
              onClick={handleToggleLock}
              title={sticker.locked ? "Unlock sticker" : "Lock sticker"}
            >
              {sticker.locked ? <Unlock size={12} /> : <Lock size={12} />}
            </div>
          )}
          
          {onToggleVisibility && (
            <div 
              className="bg-purple-500 text-white rounded-full p-1 cursor-pointer hover:bg-purple-600 transition-colors z-20 shadow-md"
              onClick={handleToggleVisibility}
              title={sticker.visible === false ? "Show sticker" : "Hide sticker"}
            >
              <Eye size={12} className={sticker.visible === false ? "opacity-50" : ""} />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom controls */}
      <div className="absolute -bottom-2 flex justify-between gap-1 w-full px-2">
        {/* Z-index controls */}
        {onChangeZIndex && (
          <div className="flex gap-1">
            <div 
              className="bg-indigo-500 text-white rounded-full p-1 cursor-pointer hover:bg-indigo-600 transition-colors z-20 shadow-md"
              onClick={handleChangeZIndex(-1)}
              title="Send backward"
            >
              <Layers size={12} className="opacity-50" />
            </div>
            <div 
              className="bg-indigo-500 text-white rounded-full p-1 cursor-pointer hover:bg-indigo-600 transition-colors z-20 shadow-md"
              onClick={handleChangeZIndex(1)}
              title="Bring forward"
            >
              <Layers size={12} />
            </div>
          </div>
        )}
        
        {/* Rotation control */}
        <div 
          className="bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
          onClick={onRotate}
          title="Rotate sticker (or press R)"
        >
          <RotateCw size={12} />
        </div>
      </div>
      
      {/* Opacity slider - only show when opacity control is available */}
      {onOpacityChange && (
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <input
            type="range"
            min="10"
            max="100"
            value={(sticker.opacity || 1) * 100}
            onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
            className="h-1 appearance-none bg-blue-200 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            style={{ transform: "rotate(90deg)", width: "60px" }}
            title="Adjust opacity"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default StickerControls;
