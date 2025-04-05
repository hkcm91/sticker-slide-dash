
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from './Sticker';
import { ChevronRight, ChevronLeft, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StickerUploader from './StickerUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

interface StickerSidebarProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerCreated: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
}

const StickerSidebar = ({ 
  stickers, 
  onDragStart, 
  onStickerClick, 
  onStickerCreated,
  onStickerDelete
}: StickerSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-32'
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
        <Tabs defaultValue="default" className="flex-1 flex flex-col">
          <TabsList className="mx-2 mt-2 grid w-[calc(100%-16px)] grid-cols-2">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-3">
            {defaultStickers.map((sticker) => (
              <Sticker
                key={sticker.id}
                sticker={sticker}
                onDragStart={onDragStart}
                onClick={onStickerClick}
                isDraggable={true}
                className="mx-auto"
              />
            ))}
            {defaultStickers.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 text-xs mt-4">
                No default stickers available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="custom" className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-3">
            {customStickers.map((sticker) => (
              <div key={sticker.id} className="relative group">
                <Sticker
                  sticker={sticker}
                  onDragStart={onDragStart}
                  onClick={onStickerClick}
                  isDraggable={true}
                  className="mx-auto"
                />
                <button 
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteFromSidebar(sticker, e)}
                  title="Delete sticker"
                >
                  <Trash size={10} />
                </button>
              </div>
            ))}
            {customStickers.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 text-xs mt-4">
                No custom stickers yet.
                <br />
                Create one using the button above!
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StickerSidebar;
