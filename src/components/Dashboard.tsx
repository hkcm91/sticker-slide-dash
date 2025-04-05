
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

// Create base64 encoded SVG strings for each icon
// This method doesn't rely on the Lucide React component's render method
const heartIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>');
const homeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>');
const coffeeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>');
const sunIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
const starIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
const bookIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>');

const initialStickers: StickerType[] = [
  { id: '1', name: 'Heart', icon: heartIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '2', name: 'Home', icon: homeIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '3', name: 'Coffee', icon: coffeeIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '4', name: 'Sun', icon: sunIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '5', name: 'Star', icon: starIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '6', name: 'Book', icon: bookIcon, position: { x: 0, y: 0 }, placed: false },
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
