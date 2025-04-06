
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from './Sticker';
import { ChevronRight, ChevronLeft, Trash, X, PackageOpen, Code } from 'lucide-react';
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

interface StickerSidebarProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerCreated: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
  onStickerUpdate?: (sticker: StickerType) => void;
}

const StickerSidebar = ({ 
  stickers, 
  onDragStart, 
  onStickerClick, 
  onStickerCreated,
  onStickerDelete,
  onStickerUpdate
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Filter all available stickers (not placed on the dashboard)
  const availableStickers = stickers.filter(sticker => !sticker.placed);

  // Handle sticker click to open edit mode
  const handleStickerClick = (sticker: StickerType) => {
    setCurrentlyEditing(sticker);
    setEditName(sticker.name);
    setEditDescription(sticker.description || '');
    setWidgetCode(sticker.widgetCode || '');
    setIsEditing(true);
    
    // Reset file states
    setSelectedFile(null);
    setPreviewUrl(null);
    setWidgetZipFile(null);
  };

  // Handle file change for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Handle widget ZIP file change
  const handleWidgetZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      console.error("Invalid file type. Please upload a ZIP file.");
      return;
    }
    
    setWidgetZipFile(file);
  };

  // Save edited sticker changes
  const handleSaveEdit = async () => {
    if (!currentlyEditing || !onStickerUpdate) return;
    
    let updatedSticker = {
      ...currentlyEditing,
      name: editName,
      description: editDescription,
    };
    
    if (previewUrl) {
      updatedSticker.icon = previewUrl;
    }

    // If it's a widget and has code updates
    if (currentlyEditing.widgetType && widgetCode.trim()) {
      try {
        // Create actions from the code
        const createActions = new Function('state', `
          return ${widgetCode};
        `);
        const widgetActions = createActions({});
        
        // Store the code as a string in the sticker metadata
        updatedSticker.widgetCode = widgetCode;
        updatedSticker.widgetActions = widgetActions;
      } catch (error) {
        console.error("Error parsing widget code:", error);
      }
    }
    
    // If user uploaded a new widget package
    if (currentlyEditing.widgetType && widgetZipFile) {
      try {
        setProcessingPackage(true);
        const newWidgetSticker = await processWidgetPackage(widgetZipFile, editName);
        setProcessingPackage(false);
        
        if (newWidgetSticker) {
          // Preserve the ID and position of the original sticker
          updatedSticker = {
            ...newWidgetSticker,
            id: currentlyEditing.id,
            position: currentlyEditing.position,
            placed: currentlyEditing.placed,
            description: editDescription,
          };
        }
      } catch (error) {
        console.error("Error processing widget package:", error);
        setProcessingPackage(false);
      }
    }
    
    onStickerUpdate(updatedSticker);
    handleCloseEdit();
  };

  // Handle deleting the current sticker
  const handleDeleteSticker = () => {
    if (currentlyEditing) {
      onStickerDelete(currentlyEditing);
      setIsDeleteDialogOpen(false);
      handleCloseEdit();
    }
  };

  // Exit edit mode
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
  };

  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-72'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && <h2 className="font-bold text-sm">Stickers</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`ml-auto rounded-full bg-sticker-purple text-white hover:bg-sticker-purple-light`}
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-2">
          <StickerUploader onStickerCreated={onStickerCreated} />
        </div>
      )}

      {isCollapsed ? (
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="w-8 h-24 bg-sticker-purple text-white flex items-center justify-center rounded-r-md cursor-pointer"
            onClick={toggleSidebar}
          >
            <span className="transform rotate-90 whitespace-nowrap text-xs font-bold">OPEN</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-2 mb-2 bg-gray-100">
            <h3 className="text-sm font-medium px-2 py-1">All Stickers</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 grid grid-cols-3 gap-3">
              {availableStickers.map((sticker) => (
                <div key={sticker.id} className="relative group flex flex-col items-center">
                  <Sticker
                    sticker={sticker}
                    onDragStart={onDragStart}
                    onClick={() => handleStickerClick(sticker)}
                    isDraggable={true}
                    className="mx-auto sticker-in-tray" // Added sticker-in-tray class
                  />
                  <p className="text-xs text-center mt-1 truncate w-full">{sticker.name}</p>
                </div>
              ))}
              {availableStickers.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 text-xs mt-4">
                  No stickers available.
                  <br />
                  Create one using the button above!
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Edit Sticker Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Sticker</SheetTitle>
            <SheetDescription>
              Make changes to your sticker. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          
          {currentlyEditing && (
            <div className="py-4 space-y-6">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage 
                    src={previewUrl || currentlyEditing.icon} 
                    alt="Sticker preview" 
                  />
                  <AvatarFallback>{editName.charAt(0)}</AvatarFallback>
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
                <Label htmlFor="sticker-image">Image</Label>
                <Input
                  id="sticker-image"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Upload a new image (optional)
                </p>
              </div>
              
              {/* Widget-specific controls - only show for widgets */}
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
              Delete Sticker
            </Button>
            <div className="flex-1"></div>
            <Button variant="outline" onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={processingPackage}>
              {processingPackage ? "Processing..." : "Save changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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
