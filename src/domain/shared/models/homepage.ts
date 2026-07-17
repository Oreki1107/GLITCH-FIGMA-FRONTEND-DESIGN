import type { CollectionModel } from './collection';
import type { ProductModel } from './product';
import type { ProductPresentation } from '@/domain/types/presentation';

export type HomepageModuleModel =
  | {
      id: string;
      type: 'hero';
      heroImageUrl: string;
      product: ProductModel | null;
    }
  | {
      id: string;
      type: 'featuredProducts';
      products: ProductModel[];
      presentations: ProductPresentation[];
    }
  | {
      id: string;
      type: 'collectionPreview';
      collections: CollectionModel[];
    }
  | {
      id: string;
      type: 'newArrivals';
      products: ProductModel[];
      presentations: ProductPresentation[];
      totalProductCount: number;
    }
  | {
      id: string;
      type: 'trending';
      products: ProductModel[];
    }
  | {
      id: string;
      type: 'categories';
      categories: Array<{ handle: string; title: string }>;
    }
  | {
      id: string;
      type: 'editorial';
      collection: CollectionModel;
    }
  | {
      id: string;
      type: 'archive';
      products: ProductModel[];
    }
  | {
      id: string;
      type: 'curatedFit';
      products: ProductModel[];
      presentations: ProductPresentation[];
      defaultCategoryHandle: string | null;
    }
  | {
      id: string;
      type: 'continueExploring';
    };
