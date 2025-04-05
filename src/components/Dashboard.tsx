
import React, { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import StickerSidebar from './StickerSidebar';
import Sticker from './Sticker';
import WidgetModal from './WidgetModal';
import BackgroundUploader from './BackgroundUploader';
import { useToast } from '@/hooks/use-toast';

// Import cozy icons from lucide-react
import { Heart, Home, Coffee, Sun, Star, BookOpen } from 'lucide-react';

// Create SVG strings from the Lucide icons
const getIconSvg = (Icon: any) => {
  const svgString = Icon.render().props.children.props.children;
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgString}</svg>`;
};

const initialStickers: StickerType[] = [
  { id: '1', name: 'Heart', icon: getIconSvg(Heart), position: { x: 0, y: 0 }, placed: false },
  { id: '2', name: 'Home', icon: getIconSvg(Home), position: { x: 0, y: 0 }, placed: false },
  { id: '3', name: 'Coffee', icon: getIconSvg(Coffee), position: { x: 0, y: 0 }, placed: false },
  { id: '4', name: 'Sun', icon: getIconSvg(Sun), position: { x: 0, y: 0 }, placed: false },
  { id: '5', name: 'Star', icon: getIconSvg(Star), position: { x: 0, y: 0 }, placed: false },
  { id: '6', name: 'Book', icon: getIconSvg(BookOpen), position: { x: 0, y: 0 }, placed: false },
];

const widgetDataMap: Record<string, WidgetData> = {
  'Heart': { title: 'Heart Widget', content: 'Track your favorites and loved items.' },
  'Home': { title: 'Home Widget', content: 'Control your smart home devices.' },
  'Coffee': { title: 'Coffee Widget', content: 'Find the best coffee shops nearby.' },
  'Sun': { title: 'Sun Widget', content: 'Check today\'s sunrise and sunset times.' },
  'Star': { title: 'Star Widget', content: 'View your starred and favorite items.' },
  'Book': { title: 'Book Widget', content: 'Access your reading list and book notes.' },
};

const Dashboard = () => {
  const [stickers, setStickers] = useState<StickerType[]>(initialStickers);
  const [background, setBackground] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSticker, setActiveSticker] = useState<StickerType | null>(null);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const { toast } = useToast();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    e.dataTransfer.setData('stickerId', sticker.id);
    // Record if we're repositioning an already placed sticker
    setIsRepositioning(sticker.placed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('stickerId');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX') || '0', 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY') || '0', 10);
    
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate position accounting for the offset
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, position: { x, y }, placed: true } 
          : sticker
      )
    );
    
    // Show different toast messages based on whether we're placing or repositioning
    if (isRepositioning) {
      toast({
        title: "Sticker repositioned!",
        description: "Your sticker has been moved to a new position.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sticker placed!",
        description: "Click on the sticker to open the widget.",
        duration: 3000,
      });
    }
    
    setIsRepositioning(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleStickerClick = (sticker: StickerType) => {
    if (sticker.placed) {
      setActiveSticker(sticker);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveSticker(null);
  };

  const handleBackgroundChange = (url: string | null) => {
    setBackground(url);
  };

  // Get the widget data for the active sticker
  const activeWidgetData = activeSticker ? widgetDataMap[activeSticker.name] : null;

  // Filter stickers that have been placed
  const placedStickers = stickers.filter(sticker => sticker.placed);

  return (
    <div className="flex h-screen overflow-hidden">
      <StickerSidebar 
        stickers={stickers} 
        onDragStart={handleDragStart} 
        onStickerClick={handleStickerClick} 
      />
      
      <div 
        className="flex-1 relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={background ? {
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className={`absolute inset-0 ${background ? 'bg-black/10' : 'bg-white'}`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Sticker Dashboard</h1>
            <p className="text-gray-600 mb-6">
              {placedStickers.length === 0 
                ? "Drag stickers from the sidebar and drop them here" 
                : "Click on stickers to open widgets, drag to reposition"}
            </p>
            
            <div className="mt-6 h-full">
              {placedStickers.map(sticker => (
                <Sticker
                  key={sticker.id}
                  sticker={sticker}
                  onDragStart={handleDragStart}
                  onClick={handleStickerClick}
                  isDraggable={true}  // Make placed stickers draggable
                />
              ))}
            </div>
          </div>
        </div>
        
        <BackgroundUploader 
          onBackgroundChange={handleBackgroundChange} 
          currentBackground={background} 
        />
      </div>
      
      <WidgetModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        sticker={activeSticker} 
        widgetData={activeWidgetData} 
      />
    </div>
  );
};

export default Dashboard;
