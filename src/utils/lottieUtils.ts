
import { LottieAnimationData } from '@/types/stickers';

/**
 * Validates a Lottie animation data object or string
 * 
 * @param animation Animation data (string or object)
 * @returns An object with validation results
 */
export const validateLottieAnimation = (
  animation: string | object | undefined
): { isValid: boolean; data: LottieAnimationData | null } => {
  try {
    if (!animation) {
      return { isValid: false, data: null };
    }

    let lottieData: LottieAnimationData | null = null;
    
    if (typeof animation === 'string') {
      if (animation.trim().startsWith('{')) {
        try {
          const parsedData = JSON.parse(animation);
          if (parsedData && 
              typeof parsedData === 'object' && 
              'v' in parsedData && 
              'layers' in parsedData && 
              Array.isArray(parsedData.layers) &&
              parsedData.layers.length > 0) {
            lottieData = parsedData;
            return { isValid: true, data: lottieData };
          }
        } catch (e) {
          console.error('Failed to parse Lottie animation JSON:', e);
        }
      } else if (animation.trim().startsWith('http')) {
        console.log('Lottie animation URL detected, using fallback');
      }
    } else if (animation && 
              typeof animation === 'object' &&
              'v' in animation && 
              'layers' in animation &&
              Array.isArray((animation as any).layers) &&
              (animation as any).layers.length > 0) {
      lottieData = animation as LottieAnimationData;
      return { isValid: true, data: lottieData };
    }
    
    return { isValid: false, data: null };
  } catch (e) {
    console.error('Failed to process Lottie animation:', e);
    return { isValid: false, data: null };
  }
};
