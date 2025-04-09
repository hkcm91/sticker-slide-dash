
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StickerImageUploadProps {
  isUrlInputVisible: boolean;
  toggleUrlInput: () => void;
  iconUrl: string;
  handleIconUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadImageFromUrl: () => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StickerImageUpload: React.FC<StickerImageUploadProps> = ({
  isUrlInputVisible,
  toggleUrlInput,
  iconUrl,
  handleIconUrlChange,
  loadImageFromUrl,
  handleFileChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="sticker-image">Image</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleUrlInput}
          className="flex items-center gap-1"
        >
          <Link size={14} />
          {isUrlInputVisible ? "Use File Upload" : "Use URL"}
        </Button>
      </div>
      
      {isUrlInputVisible ? (
        <div className="flex gap-2">
          <Input
            id="icon-url"
            type="url"
            value={iconUrl}
            onChange={handleIconUrlChange}
            placeholder="Enter image or Lottie URL"
            className="flex-1"
          />
          <Button size="sm" onClick={loadImageFromUrl}>Load</Button>
        </div>
      ) : (
        <Input
          id="sticker-image"
          type="file"
          onChange={handleFileChange}
          accept="image/*,.json"
          className="w-full"
        />
      )}
      
      <p className="text-xs text-gray-500">
        {isUrlInputVisible 
          ? "Enter a URL for an image or Lottie animation (.json)" 
          : "Upload a new image or Lottie animation (optional)"}
      </p>
    </div>
  );
};

export default StickerImageUpload;
