
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StickerPreview } from './';
import { StickerBasicInfo } from './';
import { StickerImageUpload } from './';
import { StickerWidgetSettings } from './';

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
      <StickerPreview 
        previewUrl={previewUrl} 
        icon={currentlyEditing.icon} 
        name={editName} 
      />
      
      <StickerBasicInfo 
        editName={editName}
        setEditName={setEditName}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
      />
      
      <StickerImageUpload 
        isUrlInputVisible={isUrlInputVisible}
        toggleUrlInput={toggleUrlInput}
        iconUrl={iconUrl}
        handleIconUrlChange={handleIconUrlChange}
        loadImageFromUrl={loadImageFromUrl}
        handleFileChange={handleFileChange}
      />
      
      <StickerWidgetSettings 
        widgetType={currentlyEditing.widgetType}
        showCodeEditor={showCodeEditor}
        setShowCodeEditor={setShowCodeEditor}
        widgetCode={widgetCode}
        setWidgetCode={setWidgetCode}
        widgetZipFile={widgetZipFile}
        handleWidgetZipChange={handleWidgetZipChange}
        widgetLottieFile={widgetLottieFile}
        handleWidgetLottieChange={handleWidgetLottieChange}
      />

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
