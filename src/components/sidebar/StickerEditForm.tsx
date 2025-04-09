
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code, Link, Trash, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StickerEditFormProps {
  currentlyEditing: StickerType | null;
  onSave: (updatedSticker: StickerType) => void;
  onDelete: () => void;
  onCancel: () => void;
  processingPackage: boolean;
}

const StickerEditForm: React.FC<StickerEditFormProps> = ({
  currentlyEditing,
  onSave,
  onDelete,
  onCancel,
  processingPackage
}) => {
  const [editName, setEditName] = useState(currentlyEditing?.name || '');
  const [editDescription, setEditDescription] = useState(currentlyEditing?.description || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentlyEditing?.icon || null);
  const [widgetCode, setWidgetCode] = useState(currentlyEditing?.widgetCode || '');
  const [widgetZipFile, setWidgetZipFile] = useState<File | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [iconUrl, setIconUrl] = useState('');
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const [widgetLottieFile, setWidgetLottieFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          try {
            JSON.parse(content);
            setPreviewUrl(content);
          } catch (e) {
            setPreviewUrl(event.target.result as string);
          }
        }
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidgetZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file for the widget package.",
        variant: "destructive",
      });
      return;
    }
    
    setWidgetZipFile(file);
  };

  const handleWidgetLottieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file for the Lottie animation.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        try {
          const content = event.target.result as string;
          JSON.parse(content);
          setWidgetLottieFile(file);
          toast({
            title: "Lottie file loaded",
            description: "Lottie animation file has been loaded successfully.",
          });
        } catch (e) {
          toast({
            title: "Invalid Lottie file",
            description: "The JSON file is not a valid Lottie animation.",
            variant: "destructive",
          });
          setWidgetLottieFile(null);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconUrl(e.target.value);
  };

  const toggleUrlInput = () => {
    setIsUrlInputVisible(!isUrlInputVisible);
  };

  const loadImageFromUrl = async () => {
    if (!iconUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL for your image or Lottie animation.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLottieUrl = iconUrl.endsWith('.json') || iconUrl.includes('lottiefiles');
      
      if (isLottieUrl) {
        const response = await fetch(iconUrl);
        if (!response.ok) throw new Error('Failed to fetch Lottie animation');
        const lottieData = await response.text();
        setPreviewUrl(lottieData);
      } else {
        setPreviewUrl(iconUrl);
      }
      
      toast({
        title: "Image loaded",
        description: "The image from URL has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading image from URL:", error);
      toast({
        title: "Error loading image",
        description: "Failed to load the image from the provided URL.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!currentlyEditing) return;
    
    const updatedSticker = {
      ...currentlyEditing,
      name: editName,
      description: editDescription,
    };
    
    if (previewUrl) {
      if (isUrlInputVisible && iconUrl.endsWith('.json')) {
        updatedSticker.icon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiPjwvY2lyY2xlPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PC9zdmc+';
        updatedSticker.animation = previewUrl;
        updatedSticker.animationType = 'lottie';
      } else if (selectedFile?.type === 'application/json' || selectedFile?.name.endsWith('.json')) {
        updatedSticker.icon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiPjwvY2lyY2xlPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PC9zdmc+';
        updatedSticker.animation = previewUrl;
        updatedSticker.animationType = 'lottie';
      } else {
        updatedSticker.icon = previewUrl;
        updatedSticker.animation = undefined;
        updatedSticker.animationType = undefined;
      }
    }

    if (currentlyEditing.widgetType && widgetCode.trim()) {
      try {
        const createActions = new Function('state', `
          return ${widgetCode};
        `);
        const widgetActions = createActions({});
        
        updatedSticker.widgetCode = widgetCode;
        updatedSticker.widgetActions = widgetActions;
      } catch (error) {
        console.error("Error parsing widget code:", error);
        toast({
          title: "Widget code error",
          description: "There was an error in your widget code. Please check the syntax.",
          variant: "destructive",
        });
      }
    }
    
    onSave({
      ...updatedSticker,
      widgetZipFile,
      widgetLottieFile
    } as any); // Using 'as any' to pass the files to parent component
  };

  if (!currentlyEditing) {
    return null;
  }

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-center mb-4">
        <Avatar className="w-20 h-20 border-2 border-purple-200 shadow-md">
          <AvatarImage 
            src={previewUrl || currentlyEditing.icon} 
            alt="Sticker preview" 
          />
          <AvatarFallback className="bg-gradient-to-br from-sticker-purple to-sticker-blue text-white">
            {editName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
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
      
      {currentlyEditing.widgetType && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Widget Settings</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="widget-code">Widget Code</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className="flex items-center gap-1"
                >
                  <Code size={14} />
                  {showCodeEditor ? "Hide Code" : "Edit Code"}
                </Button>
              </div>
              
              {showCodeEditor && (
                <Textarea
                  id="widget-code"
                  value={widgetCode}
                  onChange={(e) => setWidgetCode(e.target.value)}
                  className="font-mono text-xs"
                  placeholder={`// Define your widget actions
{
  increment: (state) => ({ ...state, count: (state.count || 0) + 1 }),
  decrement: (state) => ({ ...state, count: (state.count || 0) - 1 }),
  reset: (state) => ({ ...state, count: 0 })
}`}
                  rows={8}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="widget-zip">Replace Widget Package</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="widget-zip"
                  type="file"
                  onChange={handleWidgetZipChange}
                  accept=".zip"
                  className="flex-1"
                />
                {widgetZipFile && (
                  <div className="text-xs text-green-600">
                    ✓ {widgetZipFile.name}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload a new widget package to completely replace this widget (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-lottie">Widget Lottie Animation</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="widget-lottie"
                  type="file"
                  onChange={handleWidgetLottieChange}
                  accept=".json"
                  className="flex-1"
                />
                {widgetLottieFile && (
                  <div className="text-xs text-green-600">
                    ✓ {widgetLottieFile.name}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload a Lottie animation file for this widget (optional)
              </p>
            </div>
          </div>
        </>
      )}

      <div className="pt-6 flex flex-col sm:flex-row gap-2 mt-auto">
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="w-full sm:w-auto"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <div className="flex-1"></div>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={processingPackage} className="bg-sticker-purple hover:bg-sticker-purple-light">
          {processingPackage ? "Processing..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default StickerEditForm;
