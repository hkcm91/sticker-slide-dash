
import React, { useRef, useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { validateLottieAnimation } from '@/utils/lottieUtils';

interface StickerContentProps {
  sticker: StickerType;
}

const StickerContent: React.FC<StickerContentProps> = ({ sticker }) => {
  const [lottieError, setLottieError] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { isValid: isValidLottie, data: lottieData } = 
    sticker.animationType === 'lottie' && sticker.animation 
      ? validateLottieAnimation(sticker.animation)
      : { isValid: false, data: null };

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
              lottieRef={lottieRef}
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
    
    return (
      <div className="flex items-center justify-center w-full h-full bg-violet-100 rounded-full">
        <span className="text-violet-600 text-xs font-medium">Lottie</span>
      </div>
    );
  }

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
};

export default StickerContent;
