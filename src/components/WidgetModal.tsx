
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={sticker.icon} alt={sticker.name} className="w-6 h-6" />
            {widgetData.title}
          </DialogTitle>
          <DialogDescription>
            This is a simple widget that will be expanded in the future.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {widgetData.content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetModal;
