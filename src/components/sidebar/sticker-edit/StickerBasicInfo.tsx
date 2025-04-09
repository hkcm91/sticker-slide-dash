
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StickerBasicInfoProps {
  editName: string;
  setEditName: (name: string) => void;
  editDescription: string;
  setEditDescription: (description: string) => void;
}

const StickerBasicInfo: React.FC<StickerBasicInfoProps> = ({
  editName,
  setEditName,
  editDescription,
  setEditDescription
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="sticker-name">Name</Label>
        <Input
          id="sticker-name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full"
          placeholder="Enter sticker name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sticker-description">Description</Label>
        <Textarea
          id="sticker-description"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full"
          placeholder="Enter sticker description"
          rows={3}
        />
      </div>
    </>
  );
};

export default StickerBasicInfo;
