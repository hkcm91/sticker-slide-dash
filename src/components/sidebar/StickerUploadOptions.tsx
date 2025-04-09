
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StickerUploader from '@/components/StickerUploader';

interface StickerUploadOptionsProps {
  stickers: StickerType[];
  onStickerCreated: (sticker: StickerType) => void;
  onImportStickers?: (stickers: StickerType[]) => void;
}

const StickerUploadOptions: React.FC<StickerUploadOptionsProps> = ({ 
  stickers, 
  onStickerCreated,
  onImportStickers
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="p-3 space-y-4">
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="w-full bg-sticker-purple hover:bg-sticker-purple-light"
      >
        Create Sticker
      </Button>
      
      {isDialogOpen && (
        <StickerUploader 
          onStickerCreated={(sticker) => {
            onStickerCreated(sticker);
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default StickerUploadOptions;
