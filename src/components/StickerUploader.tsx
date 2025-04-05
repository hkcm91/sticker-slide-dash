
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { createWidgetSticker } from '@/utils/createWidgetSticker';
import { Sticker } from '@/types/stickers';

interface StickerUploaderProps {
  onStickerCreated: (sticker: Sticker) => void;
}

const StickerUploader: React.FC<StickerUploaderProps> = ({ onStickerCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLottie, setIsLottie] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Check if it's a Lottie JSON file
    const isLottieFile = file.type === 'application/json' || file.name.endsWith('.json');
    setIsLottie(isLottieFile);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    
    if (isLottieFile) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !selectedFile || !previewUrl) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload an image or Lottie file.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new sticker
      const newSticker: Sticker = {
        id: uuidv4(),
        name,
        icon: isLottie ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiPjwvY2lyY2xlPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PC9zdmc+' : previewUrl,
        position: { x: 0, y: 0 },
        placed: false,
        size: 60,
        rotation: 0,
        isCustom: true,
      };

      // Add animation data if it's a Lottie file
      if (isLottie) {
        newSticker.animation = previewUrl;
        newSticker.animationType = 'lottie';
      }

      onStickerCreated(newSticker);
      setIsOpen(false);
      resetForm();

      toast({
        title: "Sticker created!",
        description: `${name} has been added to your stickers.`,
      });
    } catch (error) {
      console.error("Error creating sticker:", error);
      toast({
        title: "Error creating sticker",
        description: "There was a problem creating your sticker.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLottie(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full mb-3 bg-sticker-purple text-white hover:bg-sticker-purple-light"
      >
        <Plus className="mr-2" size={16} />
        Create Sticker
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Custom Sticker</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="My Custom Sticker"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.gif,.svg,.json"
                  className="col-span-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports: PNG, JPG, GIF, SVG, Lottie JSON
                </p>
              </div>
            </div>
            
            {previewUrl && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3 flex justify-center">
                  {isLottie ? (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">Lottie</span>
                    </div>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-16 h-16 object-contain rounded-full"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Sticker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickerUploader;
