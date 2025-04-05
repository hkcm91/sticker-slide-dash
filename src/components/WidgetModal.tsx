
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './widgets/PomodoroWidget';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  if (!sticker || !widgetData) return null;

  // Determine if we have a custom component for this widget type
  const renderWidgetContent = () => {
    if (sticker.widgetType === 'Pomodoro') {
      return <PomodoroWidgetUI widgetName="Pomodoro" />;
    }
    
    // Default content if no special widget is available
    return <div className="py-4">{widgetData.content}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={sticker.icon} alt={sticker.name} className="w-6 h-6" />
            {widgetData.title}
          </DialogTitle>
          <DialogDescription>
            {sticker.widgetType 
              ? `This is a ${sticker.widgetType} widget with special functionality.` 
              : "This is a simple widget that will be expanded in the future."}
          </DialogDescription>
        </DialogHeader>
        {renderWidgetContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WidgetModal;
