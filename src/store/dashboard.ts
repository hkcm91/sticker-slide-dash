
import { create } from 'zustand';
import { Sticker } from '@/types/stickers';

interface DashboardState {
  placedStickers: Sticker[];
  selectedStickers: string[];
  ungroupSticker: (stickerId: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  placedStickers: [],
  selectedStickers: [],
  ungroupSticker: (stickerId: string) => {
    set((state) => {
      const sticker = state.placedStickers.find(s => s.id === stickerId);
      if (!sticker || !sticker.groupId) return state;
      
      const groupId = sticker.groupId;
      
      return {
        placedStickers: state.placedStickers.map(s => 
          s.groupId === groupId ? { ...s, groupId: undefined } : s
        )
      };
    });
  },
}));
