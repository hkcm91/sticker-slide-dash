
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StickersList from './StickersList';
import StickerUploadOptions from './StickerUploadOptions';
import WidgetMarketplace from './WidgetMarketplace';

interface SidebarTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  stickers: StickerType[];
  onStickerCreated: (sticker: StickerType) => void;
  onImportStickers?: (stickers: StickerType[]) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({
  activeTab,
  onTabChange,
  stickers,
  onStickerCreated,
  onImportStickers,
  onDragStart,
  onStickerClick
}) => {
  const handleImportStickers = (importedStickers: StickerType[]) => {
    if (onImportStickers) {
      onImportStickers(importedStickers);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
      <div className="px-3 pt-1">
        <TabsList className="w-full">
          <TabsTrigger value="stickers" className="flex-1">Stickers</TabsTrigger>
          <TabsTrigger value="marketplace" className="flex-1">Marketplace</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="stickers" className="flex-1 flex flex-col mt-2">
        <StickerUploadOptions 
          stickers={stickers}
          onStickerCreated={onStickerCreated}
          onImportStickers={handleImportStickers}
        />
        
        <StickersList 
          stickers={stickers}
          onDragStart={onDragStart}
          onStickerClick={onStickerClick}
        />
      </TabsContent>
      
      <TabsContent value="marketplace" className="flex-1 flex flex-col mt-0">
        <WidgetMarketplace 
          onAddSticker={onStickerCreated}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SidebarTabs;
