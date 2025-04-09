
import React, { useState, useRef, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import { ArrowLeftCircle, RotateCw, AlertTriangle } from 'lucide-react';
import Lottie from 'lottie-react';

interface StickerProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
  onDelete?: (sticker: StickerType) => void;
  onUpdate?: (sticker: StickerType) => void;
}

interface LottieAnimationData {
  v: string | number;
  layers: any[];
  [key: string]: any;
}

const Sticker = ({ 
  sticker, 
  onDragStart, 
  onClick, 
  isDraggable, 
  className,
  onDelete,
  onUpdate
}: StickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState(sticker.size || 60);
  const [rotation, setRotation] = useState(sticker.rotation || 0);
  const stickerRef = useRef<HTMLDivElement>(null);
  const [lottieData, setLottieData] = useState<LottieAnimationData | null>(null);
  const [isValidLottie, setIsValidLottie] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  
  useEffect(() => {
    if (sticker.animation && sticker.animationType === 'lottie') {
      setIsValidLottie(false);
      setLottieError(false);
      
      try {
        if (typeof sticker.animation === 'string') {
          if (sticker.animation.trim().startsWith('{')) {
            try {
              const parsedData = JSON.parse(sticker.animation);
              if (parsedData && typeof parsedData === 'object' && 
                  'v' in parsedData && 
                  'layers' in parsedData && 
                  Array.isArray(parsedData.layers) &&
                  parsedData.layers.length > 0) {
                setLottieData(parsedData);
                setIsValidLottie(true);
              } else {
                console.error('Invalid Lottie animation data structure in Sticker');
                setIsValidLottie(false);
              }
            } catch (e) {
              console.error('Failed to parse Lottie animation JSON in Sticker:', e);
              setIsValidLottie(false);
            }
          } else if (sticker.animation.trim().startsWith('http')) {
            // It's a URL, we'll need to handle this differently or provide a fallback
            console.log('Lottie URL detected in Sticker, using fallback');
            setIsValidLottie(false);
          } else {
            setIsValidLottie(false);
          }
        } else if (sticker.animation && typeof sticker.animation === 'object' &&
                 'v' in sticker.animation && 
                 'layers' in sticker.animation &&
                 Array.isArray(sticker.animation.layers) &&
                 sticker.animation.layers.length > 0) {
          setLottieData(sticker.animation as LottieAnimationData);
          setIsValidLottie(true);
        } else {
          console.error('Invalid Lottie animation object structure in Sticker');
          setIsValidLottie(false);
        }
      } catch (e) {
        console.error('Failed to process Lottie animation in Sticker:', e);
        setIsValidLottie(false);
      }
    }
  }, [sticker.animation, sticker.animationType]);

  useEffect(() => {
    if (sticker.placed && onUpdate) {
      onUpdate({
        ...sticker,
        size,
        rotation
      });
    }
  }, [size, rotation, sticker.placed]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('stickerId', sticker.id);
    
    if (stickerRef.current) {
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      e.dataTransfer.setData('offsetX', String(offsetX));
      e.dataTransfer.setData('offsetY', String(offsetY));
      
      e.dataTransfer.setDragImage(stickerRef.current, offsetX, offsetY);
    }
    
    onDragStart(e, sticker);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(sticker);
    }
  };

  const handleResize = (e: React.WheelEvent) => {
    if (sticker.placed) {
      e.preventDefault();
      
      const newSize = e.deltaY < 0 ? size + 5 : size - 5;
      setSize(Math.max(30, Math.min(120, newSize)));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHovered && e.key.toLowerCase() === 'r') {
        setRotation((prev) => (prev + 15) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered]);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 15) % 360);
  };

  const renderStickerContent = () => {
    if (sticker.animationType === 'lottie') {
      if (isValidLottie && lottieData && !lottieError) {
        try {
          return (
            <div className="w-full h-full p-2">
              <Lottie 
                animationData={lottieData} 
                loop={true} 
                className="w-full h-full"
                onError={(e) => {
                  console.error("Lottie animation failed to render in Sticker:", e);
                  setLottieError(true);
                }}
                lottieRef={(ref) => {
                  if (ref) {
                    ref.addEventListener('error', () => {
                      console.error("Lottie animation error event in Sticker");
                      setLottieError(true);
                    });
                  }
                }}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid slice',
                  progressiveLoad: true,
                  hideOnTransparent: false,
                }}
              />
            </div>
          );
        } catch (error) {
          console.error("Error rendering Lottie animation in Sticker:", error);
          setLottieError(true);
        }
      }
      
      // Fallback for invalid Lottie
      return (
        <div className="flex items-center justify-center w-full h-full bg-violet-100 rounded-full">
          <span className="text-violet-600 text-xs font-medium">Lottie</span>
        </div>
      );
    } else {
      return (
        <img 
          key={`${sticker.id}-${sticker.placed ? 'placed' : 'tray'}`}
          src={sticker.icon} 
          alt={sticker.name} 
          className="w-full h-full p-2" 
          draggable={false}
          style={{ backgroundColor: 'transparent' }}
          onError={(e) => {
            console.error("Failed to load sticker image:", sticker.icon);
            (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAzSDVhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNWEyIDIgMCAwIDAtMi0yWiIvPjxwYXRoIGQ9Ik04LjUgMTBhMS41IDEuNSAwIDEgMCAwLTMgMS41IDEuNSAwIDAgMCAwIDNaIi8+PHBhdGggZD0ibTIxIDE1LTMuODYtMy45NmEyIDIgMCAwIDAtMi44NCAwTDYgMjAiLz48L3N2Zz4=";
          }}
        />
      );
    }
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        className?.includes('sticker-in-tray') && !sticker.placed ? 
          'border-4 border-white/80 shadow-md hover:shadow-lg transition-all duration-200 bg-white/90' : '',
        className
      )}
      draggable={isDraggable || sticker.placed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(sticker)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleResize}
      style={
        sticker.placed 
          ? { 
              position: 'absolute', 
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation}deg)`,
              zIndex: 10,
              transition: 'transform 0.2s ease'
            } 
          : {}
      }
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {renderStickerContent()}
        
        {sticker.placed && isHovered && (
          <>
            {onDelete && (
              <div 
                className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
                onClick={handleDelete}
                title="Return to tray"
              >
                <ArrowLeftCircle size={12} />
              </div>
            )}
            
            <div 
              className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20 shadow-md"
              onClick={handleRotate}
              title="Rotate sticker (or press R)"
            >
              <RotateCw size={12} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sticker;
