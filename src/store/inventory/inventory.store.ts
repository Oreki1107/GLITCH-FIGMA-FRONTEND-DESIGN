import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  available: boolean;
}

interface InventoryState {
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
}));
