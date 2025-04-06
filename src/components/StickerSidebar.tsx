import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from './Sticker';
import { ChevronRight, ChevronLeft, Trash, X, PackageOpen, Code, Link, Sparkles, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StickerUploader from './StickerUploader';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { processWidgetPackage } from '@/utils/widgetMaster';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import BackupRestoreData from './BackupRestoreData';

interface StickerSidebarProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerCreated: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
  onStickerUpdate?: (sticker: StickerType) => void;
  onImportStickers?: (stickers: StickerType[]) => void;
  sidebarStyle: 'default' | 'minimal' | 'colorful';
}

const StickerSidebar = ({ 
  stickers, 
  onDragStart, 
  onStickerClick, 
  onStickerCreated,
  onStickerDelete,
  onStickerUpdate,
  onImportStickers,
  sidebarStyle
}: StickerSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<StickerType | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [widgetCode, setWidgetCode] = useState('');
  const [widgetZipFile, setWidgetZipFile] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [processingPackage, setProcessingPackage] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [iconUrl, setIconUrl] = useState('');
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const [widgetLottieFile, setWidgetLottieFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const availableStickers = stickers.filter(sticker => !sticker.placed);

  const handleStickerClick = (sticker: StickerType) => {
    setCurrentlyEditing(sticker);
    setEditName(sticker.name);
    setEditDescription(sticker.description || '');
    setWidgetCode(sticker.widgetCode || '');
    setIsEditing(true);
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setWidgetZipFile(null);
    setIconUrl('');
    setIsUrlInputVisible(false);
  };

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

  const handleSaveEdit = async () => {
    if (!currentlyEditing || !onStickerUpdate) return;
    
    let updatedSticker = {
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
    
    if (currentlyEditing.widgetType && widgetZipFile) {
      try {
        setProcessingPackage(true);
        const newWidgetSticker = await processWidgetPackage(
          widgetZipFile, 
          editName, 
          selectedFile, 
          widgetLottieFile
        );
        setProcessingPackage(false);
        
        if (newWidgetSticker) {
          updatedSticker = {
            ...newWidgetSticker,
            id: currentlyEditing.id,
            position: currentlyEditing.position,
            placed: currentlyEditing.placed,
            description: editDescription,
          };
          
          toast({
            title: "Widget updated",
            description: "Your widget package has been processed successfully.",
          });
        }
      } catch (error) {
        console.error("Error processing widget package:", error);
        setProcessingPackage(false);
        toast({
          title: "Widget processing error",
          description: "There was an error processing your widget package.",
          variant: "destructive",
        });
      }
    }
    
    onStickerUpdate(updatedSticker);
    handleCloseEdit();
  };

  const handleDeleteSticker = () => {
    if (currentlyEditing) {
      if (onStickerDelete) {
        const stickerToDelete = { ...currentlyEditing, permanentDelete: true };
        onStickerDelete(stickerToDelete);
        
        toast({
          title: "Sticker permanently deleted",
          description: "The sticker has been permanently removed from your collection.",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
      handleCloseEdit();
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setCurrentlyEditing(null);
    setEditName('');
    setEditDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setWidgetCode('');
    setWidgetZipFile(null);
    setShowCodeEditor(false);
    setIconUrl('');
    setIsUrlInputVisible(false);
  };

  const handleImportStickers = (importedStickers: StickerType[]) => {
    if (onImportStickers) {
      onImportStickers(importedStickers);
    }
  };

  const getSidebarClasses = () => {
    switch (sidebarStyle) {
      case 'minimal':
        return 'bg-white/60 backdrop-blur-md border-r border-gray-200/50';
      case 'colorful':
        return 'bg-gradient-to-br from-purple-100/80 to-blue-100/80 backdrop-blur-md border-r border-purple-200/50';
      case 'default':
      default:
        return 'bg-gradient-to-br from-purple-50/90 to-blue-50/90 backdrop-blur-md border-r border-purple-200/30';
    }
  };

  const getHeaderClasses = () => {
    switch (sidebarStyle) {
      case 'minimal':
        return 'border-b border-gray-200/50 bg-gradient-to-r from-gray-100/80 to-gray-50/80 shadow-sm';
      case 'colorful':
        return 'border-b border-purple-200/50 bg-gradient-to-r from-violet-400/80 to-purple-500/80 shadow-sm';
      case 'default':
      default:
        return 'border-b border-purple-200/30 bg-gradient-to-r from-sticker-purple/90 to-sticker-blue/90 shadow-sm';
    }
  };

  return (
    <div 
      className={`h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-72'
      } ${getSidebarClasses()}`}
    >
      {isCollapsed ? (
        <div className="flex-1 flex items-center justify-center">
          <button 
            className="group p-2 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Open sticker tray"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-white/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <ChevronRight size={16} className="text-sticker-purple" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center rotate-12 transform group-hover:rotate-6 transition-transform duration-300">
                <Sparkles size={8} className="text-sticker-purple" />
              </div>
            </div>
          </button>
        </div>
      ) : (
        <>
          <div className={`p-4 flex items-center justify-between ${getHeaderClasses()}`}>
            <h2 className="font-bold text-sm text-white flex items-center">
              <Sparkles size={16} className="mr-2 animate-pulse" />
              <span className="tracking-wide">Stickers</span>
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30"
              onClick={toggleSidebar}
            >
              <ChevronLeft size={16} />
            </Button>
          </div>

          <div className="p-2 flex flex-wrap gap-2">
            <div className="w-full">
              <StickerUploader onStickerCreated={onStickerCreated} />
            </div>
            <div className="w-full flex justify-end">
              {onImportStickers && (
                <BackupRestoreData 
                  stickers={stickers} 
                  onImportStickers={handleImportStickers} 
                />
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="p-2 mb-2 bg-purple-100/30 backdrop-blur-sm">
              <h3 className="text-sm font-medium px-2 py-1 text-sticker-purple">All Stickers</h3>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 grid grid-cols-3 gap-3">
                {availableStickers.map((sticker) => (
                  <div key={sticker.id} className="relative group flex flex-col items-center">
                    <div className="relative">
                      <Sticker
                        sticker={sticker}
                        onDragStart={onDragStart}
                        onClick={() => handleStickerClick(sticker)}
                        isDraggable={true}
                        className="mx-auto sticker-in-tray hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-xs text-center mt-1 truncate w-full">{sticker.name}</p>
                  </div>
                ))}
                {availableStickers.length === 0 && (
                  <div className="col-span-3 text-center text-purple-500 text-xs mt-4">
                    No stickers available.
                    <br />
                    Create one using the button above!
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-md bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-md border-l border-purple-200/50 shadow-xl">
          <SheetHeader>
            <SheetTitle className="text-sticker-purple flex items-center gap-2">
              <Sparkles size={18} className="text-sticker-purple" /> Edit Sticker
            </SheetTitle>
            <SheetDescription>
              Make changes to your sticker. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          
          {currentlyEditing && (
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
            </div>
          )}
          
          <SheetFooter className="pt-6 flex flex-col sm:flex-row gap-2 mt-auto">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <div className="flex-1"></div>
            <Button variant="outline" onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={processingPackage} className="bg-sticker-purple hover:bg-sticker-purple-light">
              {processingPackage ? "Processing..." : "Save changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sticker
              from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSticker} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StickerSidebar;
