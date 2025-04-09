
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { ArrowLeftCircle, RotateCw } from 'lucide-react';

interface StickerControlsProps {
  sticker: StickerType;
  isHovered: boolean;
  onDelete?: (sticker: StickerType) => void;
  onRotate: (e: React.MouseEvent) => void;
}

const StickerControls: React.FC<StickerControlsProps> = ({ 
  sticker, 
  isHovered, 
  onDelete,
  onRotate
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

  return (
    <>
      {onDelete && (
        <div 
          className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
          onClick={handleDelete}
          title="Return to tray"
        >
          <ArrowLeftCircle size={12} />
        </div>
      )}
      
      <div 
        className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
        onClick={onRotate}
        title="Rotate sticker (or press R)"
      >
        <RotateCw size={12} />
      </div>
    </>
  );
};

export default StickerControls;
