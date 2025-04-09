
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

import StickersList from './StickersList';
import StickerUploadOptions from './StickerUploadOptions';
import SidebarHeader from './SidebarHeader';
import CollapsedSidebar from './CollapsedSidebar';
import StickerEditForm from './sticker-edit/StickerEditForm';
import WidgetMarketplace from './WidgetMarketplace';
import { useStickerSidebar } from './hooks/useStickerSidebar';

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

const StickerSidebar: React.FC<StickerSidebarProps> = ({ 
  stickers, 
  onDragStart, 
  onStickerClick, 
  onStickerCreated,
  onStickerDelete,
  onStickerUpdate,
  onImportStickers,
  sidebarStyle
}) => {
  const { 
    isCollapsed, 
    setIsCollapsed,
    isEditing, 
    setIsEditing,
    currentlyEditing, 
    setCurrentlyEditing,
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    processingPackage, 
    setProcessingPackage,
    activeTab, 
    setActiveTab,
    toggleSidebar,
    handleStickerClick,
    handleSaveEdit,
    handleDeleteSticker,
    handleCloseEdit,
    getSidebarClasses,
    getHeaderClasses
  } = useStickerSidebar({ 
    stickers, 
    onStickerUpdate, 
    onStickerDelete,
    sidebarStyle
  });

  const { toast } = useToast();

  return (
    <div 
      className={`h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-72'
      } ${getSidebarClasses()}`}
    >
      {isCollapsed ? (
        <CollapsedSidebar onToggleSidebar={toggleSidebar} />
      ) : (
        <>
          <SidebarHeader 
            onToggleSidebar={toggleSidebar}
            className={getHeaderClasses()}
          />

          <div className="flex-1 flex flex-col">
            <StickerUploadOptions 
              stickers={stickers}
              onStickerCreated={onStickerCreated}
              onImportStickers={onImportStickers}
            />
            
            <StickersList 
              stickers={stickers}
              onDragStart={onDragStart}
              onStickerClick={handleStickerClick}
            />
          </div>
        </>
      )}

      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-md bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-md border-l border-purple-200/50 shadow-xl">
          <SheetHeader>
            <SheetTitle className="text-sticker-purple flex items-center gap-2">
              Edit Sticker
            </SheetTitle>
            <SheetDescription>
              Make changes to your sticker. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          
          <StickerEditForm 
            currentlyEditing={currentlyEditing}
            onSave={handleSaveEdit}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onCancel={handleCloseEdit}
            processingPackage={processingPackage}
          />
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
