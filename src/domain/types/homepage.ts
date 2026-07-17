import type { GlitchCollection } from "./collection";
import type { GlitchProduct } from "./product";
import type { ProductPresentation } from "./presentation";

export type GlitchHomeModule =
  | {
      id: string;
      type: "hero";
      heroImageUrl: string;
      product: GlitchProduct | null;
    }
  | {
      id: string;
      type: "featuredProducts";
      products: GlitchProduct[];
      presentations: ProductPresentation[];
    }
  | {
      id: string;
      type: "collectionPreview";
      collections: GlitchCollection[];
    }
  | {
      id: string;
      type: "newArrivals";
      products: GlitchProduct[];
      presentations: ProductPresentation[];
      totalProductCount: number;
    }
  | {
      id: string;
      type: "trending";
      products: GlitchProduct[];
    }
  | {
      id: string;
      type: "categories";
      categories: Array<{ handle: string; title: string }>;
    }
  | {
      id: string;
      type: "editorial";
      collection: GlitchCollection;
    }
  | {
      id: string;
      type: "archive";
      products: GlitchProduct[];
    }
  | {
      id: string;
      type: "curatedFit";
      products: GlitchProduct[];
      presentations: ProductPresentation[];
      defaultCategoryHandle: string | null;
    }
  | {
      id: string;
      type: "continueExploring";
    };
