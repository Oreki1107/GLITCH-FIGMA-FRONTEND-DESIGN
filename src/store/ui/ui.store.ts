import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (value) => set({ isMobileMenuOpen: value }),
  reset: () => set({ isMobileMenuOpen: false }),
}));
