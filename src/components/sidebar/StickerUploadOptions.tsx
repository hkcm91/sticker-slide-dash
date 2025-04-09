
import React from 'react';
import { Button } from '@/components/ui/button';
import StickerUploader from '@/components/StickerUploader';
import BackupRestoreData from './BackupRestoreData';
import { Sticker } from '@/types/stickers';

interface StickerUploadOptionsProps {
  onStickerCreated: (sticker: Sticker) => void;
  onImportStickers?: (stickers: Sticker[]) => void;
  stickers: Sticker[];
}

const StickerUploadOptions: React.FC<StickerUploadOptionsProps> = ({
  onStickerCreated,
  onImportStickers,
  stickers
}) => {
  return (
    <div className="p-2 flex flex-wrap gap-2">
      <div className="w-full">
        <StickerUploader onStickerCreated={onStickerCreated} />
      </div>
      <div className="w-full flex justify-end">
        {onImportStickers && (
          <BackupRestoreData 
            stickers={stickers} 
            onImportStickers={onImportStickers} 
          />
        )}
      </div>
    </div>
  );
};

export default StickerUploadOptions;
