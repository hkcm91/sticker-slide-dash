
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

    // Parse JSON data if provided
    let widgetJsonData = undefined;
    if (jsonData.trim()) {
      try {
        widgetJsonData = JSON.parse(jsonData);
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "The provided JSON data is not valid.",
          variant: "destructive",
        });
        return;
      }
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
      widgetData: widgetJsonData,
    };

    onStickerCreated(newSticker);
    setNewStickerName('');
    setNewStickerIcon(null);
    setJsonData('');
    
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

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonData(value);

    if (value.trim()) {
      try {
        JSON.parse(value);
        setIsJsonValid(true);
      } catch (error) {
        setIsJsonValid(false);
      }
    } else {
      setIsJsonValid(true);
    }
  };

  const handleJsonFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedJson = JSON.parse(content);
        setJsonData(JSON.stringify(parsedJson, null, 2));
        setIsJsonValid(true);
        
        toast({
          title: "JSON loaded",
          description: "JSON data has been loaded and can now be connected to your sticker.",
        });
      } catch (error) {
        setIsJsonValid(false);
        toast({
          title: "Invalid JSON",
          description: "The file does not contain valid JSON data.",
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the JSON file.",
        variant: "destructive",
      });
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="widget-json">Widget JSON Data (optional)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs" 
                onClick={() => document.getElementById('json-file-import')?.click()}
              >
                <FileJson className="h-3 w-3 mr-1" />
                Import JSON
              </Button>
              <Input
                type="file"
                id="json-file-import"
                accept=".json"
                onChange={handleJsonFileImport}
                className="hidden"
              />
            </div>
            <Textarea
              id="widget-json"
              placeholder='{"key": "value"}'
              value={jsonData}
              onChange={handleJsonChange}
              className={`font-mono text-xs h-24 ${!isJsonValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {!isJsonValid && (
              <p className="text-xs text-red-500">Invalid JSON format</p>
            )}
            <p className="text-xs text-gray-500">
              Connect JSON data to your widget. This data can be accessed by the widget for display or processing.
            </p>
          </div>
          
          <Button onClick={handleCreateSticker} className="w-full bg-sticker-purple hover:bg-sticker-purple-light">
            Create Sticker
          </Button>
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
