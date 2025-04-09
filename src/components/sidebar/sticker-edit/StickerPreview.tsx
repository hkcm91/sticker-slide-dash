
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StickerPreviewProps {
  previewUrl: string | null;
  icon: string;
  name: string;
}

const StickerPreview: React.FC<StickerPreviewProps> = ({ previewUrl, icon, name }) => {
  return (
    <div className="flex justify-center mb-4">
      <Avatar className="w-20 h-20 border-2 border-purple-200 shadow-md">
        <AvatarImage 
          src={previewUrl || icon} 
          alt="Sticker preview" 
        />
        <AvatarFallback className="bg-gradient-to-br from-sticker-purple to-sticker-blue text-white">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default StickerPreview;
