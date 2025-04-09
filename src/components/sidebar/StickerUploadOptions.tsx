import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { createIcon } from '@/utils/widgetHelpers';
import { FilePlus, Upload } from 'lucide-react';

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
  const [newStickerName, setNewStickerName] = useState('');
  const [newStickerIcon, setNewStickerIcon] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleCreateSticker = () => {
    if (!newStickerName.trim()) {
      toast({
        title: "Required",
        description: "Sticker name is required.",
        variant: "destructive",
      });
      return;
    }

    let icon = createIcon(newStickerName.charAt(0).toUpperCase());
    if (newStickerIcon) {
      icon = URL.createObjectURL(newStickerIcon);
    }

    const newSticker: StickerType = {
      id: uuidv4(),
      name: newStickerName,
      icon: icon,
      position: { x: 0, y: 0 },
      placed: false,
      size: 60,
      rotation: 0,
      isCustom: true,
    };

    onStickerCreated(newSticker);
    setNewStickerName('');
    setNewStickerIcon(null);
    
    toast({
      title: "Sticker created!",
      description: `${newStickerName} has been added to your sticker collection.`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setNewStickerIcon(file || null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid JSON format: Expected an array of stickers.');
        }

        const importedStickers: StickerType[] = jsonData.map(item => ({
          ...item,
          id: uuidv4(),
          isCustom: true,
        }));

        if (onImportStickers) {
          onImportStickers(importedStickers);
          toast({
            title: "Stickers imported!",
            description: `${importedStickers.length} stickers have been added to your collection.`,
          });
        }
      } catch (error: any) {
        toast({
          title: "Import failed",
          description: error.message || "Failed to import stickers. Please ensure the JSON file is valid.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-3 space-y-4">
      <h3 className="text-sm font-medium px-2 py-1 text-sticker-purple">Create Sticker</h3>
      
      <div className="space-y-2">
        <Label htmlFor="sticker-name">Sticker Name</Label>
        <Input
          type="text"
          id="sticker-name"
          placeholder="My Awesome Sticker"
          value={newStickerName}
          onChange={(e) => setNewStickerName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sticker-icon">Sticker Icon (optional)</Label>
        <Input
          type="file"
          id="sticker-icon"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      <Button onClick={handleCreateSticker} className="w-full bg-sticker-purple hover:bg-sticker-purple-light">
        Create Sticker
      </Button>

      <div className="border-t border-gray-200/30 py-4">
        <h3 className="text-sm font-medium px-2 py-1 text-sticker-purple">Import Stickers</h3>
        <div className="space-y-2">
          <Label htmlFor="import-stickers">Import from JSON</Label>
          <Input
            type="file"
            id="import-stickers"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
          />
          <p className="text-xs text-gray-500">
            Import stickers from a JSON file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickerUploadOptions;
