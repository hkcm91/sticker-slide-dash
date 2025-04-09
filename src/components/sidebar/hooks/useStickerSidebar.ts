
import { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';
import { processWidgetPackage } from '@/utils/widgetMaster';

interface UseStickerSidebarProps {
  stickers: StickerType[];
  onStickerUpdate?: (sticker: StickerType) => void;
  onStickerDelete?: (sticker: StickerType) => void;
  sidebarStyle?: 'default' | 'minimal' | 'colorful';
}

export const useStickerSidebar = ({ 
  stickers, 
  onStickerUpdate, 
  onStickerDelete,
  sidebarStyle = 'default'
}: UseStickerSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<StickerType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [processingPackage, setProcessingPackage] = useState(false);
  const [activeTab, setActiveTab] = useState("stickers");
  
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleStickerClick = (sticker: StickerType) => {
    setCurrentlyEditing(sticker);
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedSticker: StickerType & { 
    widgetZipFile?: File; 
    widgetLottieFile?: File;
  }) => {
    if (!currentlyEditing || !onStickerUpdate) return;
    
    let finalSticker = { ...updatedSticker };
    delete (finalSticker as any).widgetZipFile;
    delete (finalSticker as any).widgetLottieFile;
    
    if (currentlyEditing.widgetType && updatedSticker.widgetZipFile) {
      try {
        setProcessingPackage(true);
        const newWidgetSticker = await processWidgetPackage(
          updatedSticker.widgetZipFile, 
          updatedSticker.name, 
          null, // No selected file for icon since we're handling it separately
          updatedSticker.widgetLottieFile
        );
        setProcessingPackage(false);
        
        if (newWidgetSticker) {
          finalSticker = {
            ...newWidgetSticker,
            id: currentlyEditing.id,
            position: currentlyEditing.position,
            placed: currentlyEditing.placed,
            description: updatedSticker.description,
            icon: updatedSticker.icon || newWidgetSticker.icon,
            animation: updatedSticker.animation || newWidgetSticker.animation,
            animationType: updatedSticker.animationType || newWidgetSticker.animationType,
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
    
    onStickerUpdate(finalSticker);
    handleCloseEdit();
  };

  const handleDeleteSticker = () => {
    if (currentlyEditing && onStickerDelete) {
      const stickerToDelete = { ...currentlyEditing, permanentDelete: true };
      onStickerDelete(stickerToDelete);
      
      toast({
        title: "Sticker permanently deleted",
        description: "The sticker has been permanently removed from your collection.",
        variant: "destructive",
      });
      
      setIsDeleteDialogOpen(false);
      handleCloseEdit();
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setCurrentlyEditing(null);
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

  return {
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
  };
};
