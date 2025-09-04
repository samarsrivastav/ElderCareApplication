import { create } from 'zustand';

interface RoomStore {
  compareList: string[];
  addToCompare: (roomId: string) => void;
  removeFromCompare: (roomId: string) => void;
  clearCompareList: () => void;
  isInCompareList: (roomId: string) => boolean;
}

/**
 * Room store for managing comparison functionality
 */
export const useRoomStore = create<RoomStore>((set, get) => ({
  compareList: [],

  addToCompare: (roomId: string) => {
    const { compareList } = get();
    if (!compareList.includes(roomId) && compareList.length < 5) {
      set({ compareList: [...compareList, roomId] });
    } else if (compareList.length >= 5) {
      // Remove the first item and add the new one
      set({ compareList: [...compareList.slice(1), roomId] });
    }
  },

  removeFromCompare: (roomId: string) => {
    const { compareList } = get();
    set({ compareList: compareList.filter(id => id !== roomId) });
  },

  clearCompareList: () => {
    set({ compareList: [] });
  },

  isInCompareList: (roomId: string) => {
    const { compareList } = get();
    return compareList.includes(roomId);
  },
}));
