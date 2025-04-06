
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from './Sticker';
import { ChevronRight, ChevronLeft, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StickerUploader from './StickerUploader';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [editName, setEditName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Filter all available stickers (not placed on the dashboard)
  const availableStickers = stickers.filter(sticker => !sticker.placed);

  // Handle deleting a sticker from the sidebar
  const handleDeleteFromSidebar = (sticker: StickerType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onStickerDelete(sticker);
  };

  // Handle sticker click to open edit mode for custom stickers or pass to parent for default stickers
  const handleStickerClick = (sticker: StickerType) => {
    if (sticker.isCustom) {
      setCurrentlyEditing(sticker.id);
      setEditName(sticker.name);
      setEditMode(true);
    } else {
      onStickerClick(sticker);
    }
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

  // Save edited sticker changes
  const handleSaveEdit = () => {
    if (!currentlyEditing || !onStickerUpdate) return;
    
    const sticker = stickers.find(s => s.id === currentlyEditing);
    if (!sticker) return;
    
    const updatedSticker = {
      ...sticker,
      name: editName,
    };
    
    if (previewUrl) {
      updatedSticker.icon = previewUrl;
    }
    
    onStickerUpdate(updatedSticker);
    handleCloseEdit();
  };

  // Exit edit mode
  const handleCloseEdit = () => {
    setEditMode(false);
    setCurrentlyEditing(null);
    setEditName('');
    setSelectedFile(null);
    setPreviewUrl(null);
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
                <Avatar className="w-20 h-20">
                  <AvatarImage 
                    src={previewUrl || stickers.find(s => s.id === currentlyEditing)?.icon} 
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
                <Label htmlFor="sticker-image">Image</Label>
                <Input
                  id="sticker-image"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.gif,.svg"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Upload a new image (optional)
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleCloseEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
              
              <Separator className="my-2" />
              
              <Button 
                className="w-full" 
                variant="destructive" 
                size="sm"
                onClick={(e) => handleDeleteFromSidebar(stickers.find(s => s.id === currentlyEditing)!, e)}
              >
                <Trash size={14} className="mr-2" />
                Delete Sticker
              </Button>
            </div>
          )}
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
                    onClick={() => sticker.isCustom ? handleStickerClick(sticker) : onStickerClick(sticker)}
                    isDraggable={true}
                    className="mx-auto"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-500 opacity-70 hover:opacity-100 mt-1"
                    onClick={(e) => handleDeleteFromSidebar(sticker, e)}
                    title="Delete sticker"
                  >
                    <Trash size={12} />
                  </Button>
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
    </div>
  );
};

export default StickerSidebar;
