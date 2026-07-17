import type { GlitchCollection } from "@/domain/types";

export const mockCollections: GlitchCollection[] = [
  {
    id: "1",
    handle: "after-image",
    title: "after image",
    number: "01",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    copy: "the first frame after the light changes.",
    accentColor: "#C6FF3D",
  },
  {
    id: "2",
    handle: "night-transit",
    title: "night transit",
    number: "02",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    copy: "clothes built between the last two stops.",
    accentColor: "#2EF2FF",
  },
  {
    id: "3",
    handle: "signal-loss",
    title: "signal loss",
    number: "03",
    imageUrl: "https://images.unsplash.com/photo-1528701800489-20be3c0ea8f7?auto=format&fit=crop&w=900&q=85",
    copy: "the things you keep when the feed drops.",
    accentColor: "#FF2E4D",
  },
];
