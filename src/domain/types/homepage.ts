import type { GlychCollection } from "./collection";
import type { GlychProduct } from "./product";
import type { ProductPresentation } from "./presentation";

export type GlychHomeModule =
  | {
      id: string;
      type: "hero";
      heroImageUrl: string;
      product: GlychProduct | null;
    }
  | {
      id: string;
      type: "featuredProducts";
      products: GlychProduct[];
      presentations: ProductPresentation[];
    }
  | {
      id: string;
      type: "collectionPreview";
      collections: GlychCollection[];
    }
  | {
      id: string;
      type: "newArrivals";
      products: GlychProduct[];
      presentations: ProductPresentation[];
      totalProductCount: number;
    }
  | {
      id: string;
      type: "trending";
      products: GlychProduct[];
    }
  | {
      id: string;
      type: "categories";
      categories: Array<{ handle: string; title: string }>;
    }
  | {
      id: string;
      type: "editorial";
      collection: GlychCollection;
    }
  | {
      id: string;
      type: "archive";
      products: GlychProduct[];
    }
  | {
      id: string;
      type: "curatedFit";
      products: GlychProduct[];
      presentations: ProductPresentation[];
      defaultCategoryHandle: string | null;
    }
  | {
      id: string;
      type: "continueExploring";
    };
