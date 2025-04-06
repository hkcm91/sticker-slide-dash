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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSimpleWidget, createSimpleIcon, processWidgetPackage } from '@/utils/widgetMaster';
import { Textarea } from '@/components/ui/textarea';

interface StickerUploaderProps {
  onStickerCreated: (sticker: Sticker) => void;
}

const StickerUploader: React.FC<StickerUploaderProps> = ({ onStickerCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLottie, setIsLottie] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('simple');

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    const isLottieFile = file.type === 'application/json' || file.name.endsWith('.json');
    setIsLottie(isLottieFile);
    
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

  const handleWidgetZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing your widget.",
        variant: "destructive",
      });
      return;
    }
    
    setWidgetZipFile(file);
  };

  const handleSubmitSimpleSticker = () => {
    if (!name.trim() || !selectedFile || !previewUrl) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload an image or Lottie file.",
        variant: "destructive",
      });
      return;
    }

    try {
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

  const handleSubmitWidgetSticker = () => {
    if (!name.trim() || !widgetTitle.trim() || !widgetDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name, title, and description for your widget sticker.",
        variant: "destructive",
      });
      return;
    }

    try {
      const letterOrEmoji = widgetEmoji || name.charAt(0).toUpperCase();
      
      let widgetActions = {};
      if (widgetCode.trim()) {
        try {
          const createActions = new Function('state', `
            return ${widgetCode};
          `);
          widgetActions = createActions({});
        } catch (error) {
          console.error("Error parsing widget code:", error);
          toast({
            title: "Error in widget code",
            description: "The widget code contains syntax errors. Please check and try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      const newSticker = createSimpleWidget({
        name,
        title: widgetTitle,
        description: widgetDescription,
        icon: selectedFile ? previewUrl! : createSimpleIcon(letterOrEmoji, widgetColor),
        backgroundColor: widgetColor,
        actions: widgetActions
      });

      onStickerCreated(newSticker);
      setIsOpen(false);
      resetForm();

      toast({
        title: "Widget sticker created!",
        description: `${name} widget has been added to your stickers.`,
      });
    } catch (error) {
      console.error("Error creating widget sticker:", error);
      toast({
        title: "Error creating widget sticker",
        description: "There was a problem creating your widget sticker.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitWidgetZip = async () => {
    if (!name.trim() || !widgetZipFile) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload a ZIP file for your widget.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSticker = await processWidgetPackage(widgetZipFile, name);
      
      if (!newSticker) {
        toast({
          title: "Error processing widget",
          description: "Failed to process the widget package. Please check the file format.",
          variant: "destructive",
        });
        return;
      }

      onStickerCreated(newSticker);
      setIsOpen(false);
      resetForm();

      toast({
        title: "Widget package uploaded!",
        description: `${name} widget package has been processed and added to your stickers.`,
      });
    } catch (error) {
      console.error("Error processing widget package:", error);
      toast({
        title: "Error processing widget",
        description: "There was a problem processing your widget package.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLottie(false);
    setWidgetTitle('');
    setWidgetDescription('');
    setWidgetColor('#4CAF50');
    setWidgetEmoji('🔧');
    setWidgetCode('');
    setWidgetZipFile(null);
    setActiveTab('simple');
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
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Sticker or Widget</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="simple" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="simple">Simple Sticker</TabsTrigger>
              <TabsTrigger value="widget">Widget Sticker</TabsTrigger>
              <TabsTrigger value="package">Upload Package</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="My Custom Sticker"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">File</Label>
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
                
                <DialogFooter className="mt-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
                  <Button onClick={handleSubmitSimpleSticker}>Create Sticker</Button>
                </DialogFooter>
              </div>
            </TabsContent>
            
            <TabsContent value="widget" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="widget-name" className="text-right">Widget Name</Label>
                  <Input
                    id="widget-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="MyWidget"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="widget-title" className="text-right">Title</Label>
                  <Input
                    id="widget-title"
                    value={widgetTitle}
                    onChange={(e) => setWidgetTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="My Awesome Widget"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="widget-description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="widget-description"
                    value={widgetDescription}
                    onChange={(e) => setWidgetDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Describe what your widget does..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="widget-color" className="text-right">Color</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="widget-color"
                      type="color"
                      value={widgetColor}
                      onChange={(e) => setWidgetColor(e.target.value)}
                      className="w-12 h-8 p-0.5"
                    />
                    <Input
                      value={widgetColor}
                      onChange={(e) => setWidgetColor(e.target.value)}
                      className="flex-1"
                      placeholder="#4CAF50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="widget-emoji" className="text-right">Icon/Emoji</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="widget-emoji"
                      value={widgetEmoji}
                      onChange={(e) => setWidgetEmoji(e.target.value)}
                      className="flex-1"
                      placeholder="🔧 or a letter"
                      maxLength={2}
                    />
                    <span className="text-sm text-gray-500 flex items-center">or</span>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept=".png,.jpg,.jpeg,.gif,.svg"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="widget-code" className="text-right pt-2">Widget Code</Label>
                  <div className="col-span-3">
                    <Textarea
                      id="widget-code"
                      value={widgetCode}
                      onChange={(e) => setWidgetCode(e.target.value)}
                      className="font-mono text-xs"
                      placeholder={`// Define your widget actions (optional)
{
  // Example:
  increment: (state) => ({ ...state, count: (state.count || 0) + 1 }),
  decrement: (state) => ({ ...state, count: (state.count || 0) - 1 }),
  reset: (state) => ({ ...state, count: 0 })
}`}
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Define actions for your widget. This creates a simple widget API.
                    </p>
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
                  <Button onClick={handleSubmitWidgetSticker}>Create Widget</Button>
                </DialogFooter>
              </div>
            </TabsContent>
            
            <TabsContent value="package" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="package-name" className="text-right">Widget Name</Label>
                  <Input
                    id="package-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="UploadedWidget"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="widget-zip" className="text-right">Widget Package</Label>
                  <div className="col-span-3">
                    <Input
                      id="widget-zip"
                      type="file"
                      onChange={handleWidgetZipChange}
                      accept=".zip"
                      className="col-span-3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a ZIP file containing your widget package
                    </p>
                  </div>
                </div>
                
                {widgetZipFile && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">Selected Package</div>
                    <div className="col-span-3 bg-gray-100 p-2 rounded text-sm">
                      {widgetZipFile.name} ({Math.round(widgetZipFile.size / 1024)} KB)
                    </div>
                  </div>
                )}
                
                <div className="col-span-4 bg-blue-50 p-4 rounded-md mt-2">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Widget Package Structure</h4>
                  <p className="text-xs text-blue-700 mb-2">
                    Your ZIP file should contain:
                  </p>
                  <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                    <li>index.js (or index.ts) - Main widget code</li>
                    <li>manifest.json - Widget definition</li>
                    <li>icon.png/svg (optional) - Widget icon</li>
                  </ul>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
                  <Button onClick={handleSubmitWidgetZip}>Upload Widget</Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickerUploader;
