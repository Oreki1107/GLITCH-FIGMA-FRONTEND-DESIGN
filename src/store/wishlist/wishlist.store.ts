import { create } from 'zustand';

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  ids: [],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((entry) => entry !== id)
        : [...state.ids, id],
    })),
  clear: () => set({ ids: [] }),
}));
