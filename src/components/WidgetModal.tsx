
import React from 'react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './widgets/PomodoroWidget';
import { X } from 'lucide-react';
import useWidgetIframe from '@/hooks/useWidgetIframe';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

// Split into sub-components to prevent hooks-related issues
const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  if (!sticker || !widgetData) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 border-none bg-transparent overflow-hidden">
        <DialogClose className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm opacity-80 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <WidgetContent sticker={sticker} widgetData={widgetData} />
      </DialogContent>
    </Dialog>
  );
};

// Separate component for widget content to avoid hook ordering issues
const WidgetContent = ({ sticker, widgetData }: { sticker: StickerType; widgetData: WidgetData }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  
  // Use our custom hook for iframe widgets
  const { isLoaded } = useWidgetIframe({
    widgetId: sticker.widgetType,
    iframeRef
  });

  // Handle different widget types
  if (sticker.widgetType === 'Pomodoro') {
    return (
      <div className="bg-background rounded-lg overflow-hidden">
        <PomodoroWidgetUI widgetName="Pomodoro" />
      </div>
    );
  }
  
  // If this is a ZIP-based widget, show the iframe
  if (sticker.packageUrl) {
    return (
      <div className="bg-background rounded-lg overflow-hidden" style={{ height: '300px', width: '100%' }}>
        <iframe 
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
          title={`${sticker.name} Widget`}
        />
      </div>
    );
  }
  
  // Fallback for other widgets
  return (
    <div className="bg-background rounded-lg p-4 w-full">
      {widgetData.title && <h3 className="text-lg font-medium mb-2">{widgetData.title}</h3>}
      {widgetData.content && <p>{widgetData.content}</p>}
    </div>
  );
};

export default WidgetModal;
