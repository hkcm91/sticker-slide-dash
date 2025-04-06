import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Upload, PackageOpen, Image, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSimpleWidget, createSimpleIcon, processWidgetPackage } from '@/utils/widgetMaster';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetDescription, setWidgetDescription] = useState('');
  const [widgetColor, setWidgetColor] = useState('#4CAF50');
  const [widgetEmoji, setWidgetEmoji] = useState('🔧');
  const [widgetCode, setWidgetCode] = useState('');
  const [widgetZipFile, setWidgetZipFile] = useState<File | null>(null);
  const [widgetIconFile, setWidgetIconFile] = useState<File | null>(null);
  const [widgetIconPreview, setWidgetIconPreview] = useState<string | null>(null);
  const [processingPackage, setProcessingPackage] = useState(false);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [iconUrl, setIconUrl] = useState('');

  const { toast } = useToast();

  const toggleInputMethod = () => {
    setIsUrlInput(!isUrlInput);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIconUrl('');
  };

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

  const handleWidgetIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for the widget icon.",
        variant: "destructive",
      });
      return;
    }
    
    setWidgetIconFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setWidgetIconPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconUrl(e.target.value);
  };

  const loadFromUrl = async () => {
    if (!iconUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL for your image or Lottie animation.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if it's a Lottie JSON URL
      const isLottieJson = iconUrl.endsWith('.json') || iconUrl.includes('lottiefiles');
      setIsLottie(isLottieJson);
      
      if (isLottieJson) {
        // For Lottie animations, we need to fetch the actual JSON
        const response = await fetch(iconUrl);
        if (!response.ok) throw new Error('Failed to fetch Lottie animation');
        const lottieData = await response.text();
        setPreviewUrl(lottieData);
      } else {
        // For regular images, we can just use the URL directly
        setPreviewUrl(iconUrl);
      }
      
      toast({
        title: "Resource loaded",
        description: "The image or animation from URL has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading from URL:", error);
      toast({
        title: "Error loading resource",
        description: "Failed to load the image or animation from the provided URL.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitSimpleSticker = () => {
    if (!name.trim() || (!selectedFile && !previewUrl)) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload an image or Lottie file, or enter a URL.",
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
        description: '',
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
      setProcessingPackage(true);
      
      const newSticker = await processWidgetPackage(widgetZipFile, name, widgetIconFile);
      
      setProcessingPackage(false);
      
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
      setProcessingPackage(false);
      
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
    setWidgetIconFile(null);
    setWidgetIconPreview(null);
    setActiveTab('simple');
    setProcessingPackage(false);
    setIsUrlInput(false);
    setIconUrl('');
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
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Create Custom Sticker or Widget</DialogTitle>
            <DialogDescription>
              Create a simple sticker, a widget with custom actions, or upload a widget package.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="simple" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 px-6">
              <TabsTrigger value="simple">Simple Sticker</TabsTrigger>
              <TabsTrigger value="widget">Widget Sticker</TabsTrigger>
              <TabsTrigger value="package">Upload Package</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[65vh] px-6">
              <TabsContent value="simple" className="space-y-4 mt-4 pb-4">
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
                    <Label htmlFor="file" className="text-right">Image</Label>
                    <div className="col-span-3">
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleInputMethod}
                        >
                          {isUrlInput ? <Upload size={14} className="mr-1" /> : <Link size={14} className="mr-1" />}
                          {isUrlInput ? "File Upload" : "URL Upload"}
                        </Button>
                      </div>
                      
                      {isUrlInput ? (
                        <div className="flex gap-2">
                          <Input
                            id="icon-url"
                            type="url"
                            value={iconUrl}
                            onChange={handleUrlChange}
                            placeholder="Enter image or Lottie URL"
                            className="flex-1"
                          />
                          <Button size="sm" onClick={loadFromUrl}>Load</Button>
                        </div>
                      ) : (
                        <Input
                          id="file"
                          type="file"
                          onChange={handleFileChange}
                          accept=".png,.jpg,.jpeg,.gif,.svg,.json"
                          className="col-span-3"
                        />
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {isUrlInput 
                          ? "Enter a URL for an image or Lottie animation (.json)"
                          : "Supports: PNG, JPG, GIF, SVG, Lottie JSON"}
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
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={previewUrl} alt="Preview" />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="widget" className="space-y-4 mt-4 pb-4">
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
                  
                  {previewUrl && !isLottie && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Preview</Label>
                      <div className="col-span-3 flex justify-center">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={previewUrl} alt="Icon Preview" />
                          <AvatarFallback>{widgetEmoji || name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
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
                </div>
              </TabsContent>
              
              <TabsContent value="package" className="space-y-4 mt-4 pb-4">
                <div className="grid gap-4">
                  <Alert className="bg-blue-50 border-blue-200 mb-4">
                    <AlertDescription className="text-blue-800">
                      Upload a widget package (ZIP file) containing your widget files.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="package-name" className="text-right">Widget Name</Label>
                    <Input
                      id="package-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      placeholder="ToDoList"
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
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="widget-icon" className="text-right">Custom Icon</Label>
                    <div className="col-span-3">
                      <Input
                        id="widget-icon"
                        type="file"
                        onChange={handleWidgetIconChange}
                        accept="image/*"
                        className="col-span-3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional: Upload a custom icon for your widget
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    {widgetZipFile && (
                      <div className="text-right">Package</div>
                    )}
                    <div className="col-span-3">
                      {widgetZipFile && (
                        <div className="bg-gray-100 p-2 rounded text-sm flex items-center mb-2">
                          <PackageOpen className="mr-2 h-4 w-4" />
                          {widgetZipFile.name} ({Math.round(widgetZipFile.size / 1024)} KB)
                        </div>
                      )}
                      
                      {widgetIconPreview && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={widgetIconPreview} alt="Icon Preview" />
                            <AvatarFallback><Image size={16} /></AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">Custom icon will be used</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-4 bg-blue-50 p-4 rounded-md mt-2">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Widget Package Structure</h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Your ZIP file should contain:
                    </p>
                    <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                      <li>manifest.json - Widget definition</li>
                      <li>icon.png/svg - Widget icon (optional)</li>
                      <li>index.html - Widget content</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
            
            <DialogFooter className="px-6 py-4 border-t">
              <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
              {activeTab === 'simple' && (
                <Button onClick={handleSubmitSimpleSticker}>Create Sticker</Button>
              )}
              {activeTab === 'widget' && (
                <Button onClick={handleSubmitWidgetSticker}>Create Widget</Button>
              )}
              {activeTab === 'package' && (
                <Button 
                  onClick={handleSubmitWidgetZip} 
                  disabled={processingPackage}
                  className="flex items-center gap-2"
                >
                  {processingPackage ? "Processing..." : "Upload Widget"}
                </Button>
              )}
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickerUploader;
