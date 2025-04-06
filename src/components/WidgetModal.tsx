
import React from 'react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import { X } from 'lucide-react';
import WidgetRenderer from './widgets/WidgetRenderer';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  if (!sticker || !widgetData) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 border-none bg-transparent overflow-hidden">
        <DialogClose className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm opacity-80 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <WidgetRenderer 
          sticker={sticker}
          widgetData={widgetData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WidgetModal;
