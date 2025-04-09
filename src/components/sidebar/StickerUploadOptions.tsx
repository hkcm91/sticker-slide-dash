
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { createIcon } from '@/utils/widgetHelpers';
import { FilePlus, Upload, FileJson } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [newStickerName, setNewStickerName] = useState('');
  const [newStickerIcon, setNewStickerIcon] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('create');
  const [jsonData, setJsonData] = useState<string>('');
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-2">
          <TabsTrigger value="create">Create Sticker</TabsTrigger>
          <TabsTrigger value="import">Import Stickers</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="w-full bg-sticker-purple hover:bg-sticker-purple-light"
          >
            Create Sticker
          </Button>
          
          {/* Render the StickerUploader dialog when button is clicked */}
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
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StickerUploadOptions;
