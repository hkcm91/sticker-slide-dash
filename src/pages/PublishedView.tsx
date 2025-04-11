
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sticker as StickerType } from '@/types/stickers';
import { loadStickersFromStorage } from '@/utils/compressionUtils';
import { initialStickers } from '@/hooks/dashboard/initialStickers';
import { initializeWidgets } from '@/widgets/builtin';

// Import only what we need for displaying stickers
import PlacedStickers from '@/components/dashboard/PlacedStickers';
import DockedWidgets from '@/components/dashboard/DockedWidgets';

const PublishedView = () => {
  const { dashboardId } = useParams();
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [background, setBackground] = useState<string | null>(null);

  // In a real application, you would fetch the published dashboard data
  // from your backend based on the dashboardId
  useEffect(() => {
    // Initialize necessary components
    initializeWidgets();
    
    // Load stickers from storage (this is a demo - would come from an API in production)
    const loadedStickers = loadStickersFromStorage(initialStickers);
    
    // Filter only placed stickers for the published view
    setStickers(loadedStickers);
    
    // Mock loading background (would come from an API in production)
    setBackground(localStorage.getItem('dashboard_background') || null);
    
    setIsLoading(false);
  }, [dashboardId]);

  // Filter placed stickers
  const placedStickers = stickers.filter(sticker => sticker.placed && !sticker.docked);
  const dockedStickers = stickers.filter(sticker => sticker.docked);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/20"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen overflow-hidden"
      style={{
        backgroundImage: background ? `url(${background})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: background ? undefined : '#f8fafc'
      }}
    >
      <div className="absolute inset-0 bg-black/5">
        <div className="h-full p-6">
          {placedStickers.length === 0 && dockedStickers.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-2">This dashboard is empty</h2>
                <p className="text-muted-foreground">There are no widgets to display</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-6 h-full">
                <PlacedStickers 
                  stickers={placedStickers.map(s => ({...s, locked: true}))} 
                  readOnly 
                />
              </div>
              
              {dockedStickers.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full">
                  <DockedWidgets 
                    dockedWidgets={dockedStickers} 
                    readOnly
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishedView;
