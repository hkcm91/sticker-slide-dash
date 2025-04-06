
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from './Sticker';
import { ChevronRight, ChevronLeft, Trash, Edit, Pencil, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import StickerUploader from './StickerUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [editMode, setEditMode] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Filter stickers by type
  const availableStickers = stickers.filter(sticker => !sticker.placed);
  const defaultStickers = availableStickers.filter(sticker => !sticker.isCustom);
  const customStickers = availableStickers.filter(sticker => sticker.isCustom);

  // Handle deleting a sticker from the sidebar
  const handleDeleteFromSidebar = (sticker: StickerType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onStickerDelete(sticker);
  };

  // Handle entering edit mode for a sticker
  const handleEditSticker = (sticker: StickerType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentlyEditing(sticker.id);
    setCurrentRotation(sticker.rotation || 0);
    setEditMode(true);
  };

  // Handle rotating a sticker in the tray
  const handleRotateSticker = (sticker: StickerType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onStickerUpdate) {
      const newRotation = ((sticker.rotation || 0) + 15) % 360;
      onStickerUpdate({
        ...sticker,
        rotation: newRotation
      });
    }
  };

  // Handle updating sticker size
  const handleSizeChange = (values: number[], sticker: StickerType) => {
    if (onStickerUpdate) {
      onStickerUpdate({
        ...sticker,
        size: values[0]
      });
    }
  };

  // Exit edit mode
  const handleCloseEdit = () => {
    setEditMode(false);
    setCurrentlyEditing(null);
  };

  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-44'
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
      ) : editMode && currentlyEditing ? (
        <div className="flex-1 flex flex-col p-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Edit Sticker</h3>
            <Button variant="ghost" size="sm" onClick={handleCloseEdit}>
              <X size={16} />
            </Button>
          </div>
          
          {stickers.find(s => s.id === currentlyEditing) && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Sticker
                  sticker={stickers.find(s => s.id === currentlyEditing)!}
                  onDragStart={() => {}}
                  onClick={() => {}}
                  isDraggable={false}
                  className="mx-auto"
                />
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Size</p>
                <Slider
                  defaultValue={[stickers.find(s => s.id === currentlyEditing)?.size || 60]}
                  max={120}
                  min={30}
                  step={5}
                  onValueChange={(values) => handleSizeChange(values, stickers.find(s => s.id === currentlyEditing)!)}
                />
              </div>
              
              <Button 
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={(e) => handleRotateSticker(stickers.find(s => s.id === currentlyEditing)!, e)}
              >
                <RotateCw size={14} className="mr-2" />
                Rotate
              </Button>
              
              {stickers.find(s => s.id === currentlyEditing)?.isCustom && (
                <Button 
                  className="w-full" 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => handleDeleteFromSidebar(stickers.find(s => s.id === currentlyEditing)!, e)}
                >
                  <Trash size={14} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="default" className="flex-1 flex flex-col">
          <TabsList className="mx-2 mt-2 grid w-[calc(100%-16px)] grid-cols-2">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 grid grid-cols-2 gap-3">
                {defaultStickers.map((sticker) => (
                  <div key={sticker.id} className="relative group flex flex-col items-center">
                    <Sticker
                      sticker={sticker}
                      onDragStart={onDragStart}
                      onClick={onStickerClick}
                      isDraggable={true}
                      className="mx-auto"
                    />
                    <div className="mt-1 flex justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={(e) => handleEditSticker(sticker, e)}
                        title="Edit sticker"
                      >
                        <Pencil size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
                {defaultStickers.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500 text-xs mt-4">
                    No default stickers available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="custom" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 grid grid-cols-2 gap-3">
                {customStickers.map((sticker) => (
                  <div key={sticker.id} className="relative group flex flex-col items-center">
                    <Sticker
                      sticker={sticker}
                      onDragStart={onDragStart}
                      onClick={onStickerClick}
                      isDraggable={true}
                      className="mx-auto"
                    />
                    <div className="mt-1 flex justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={(e) => handleEditSticker(sticker, e)}
                        title="Edit sticker"
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 opacity-70 hover:opacity-100"
                        onClick={(e) => handleDeleteFromSidebar(sticker, e)}
                        title="Delete sticker"
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
                {customStickers.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500 text-xs mt-4">
                    No custom stickers yet.
                    <br />
                    Create one using the button above!
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StickerSidebar;
