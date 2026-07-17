import type { GlitchCollection, GlitchProduct } from '@/domain/types';
import type { CatalogFilters } from '@/domain/types/navigation';

export interface CatalogService {
  getProducts(): Promise<GlitchProduct[]>;
  getProductById(id: string): Promise<GlitchProduct | null>;
  getCollections(): Promise<GlitchCollection[]>;
  filterProducts(filters: CatalogFilters): Promise<GlitchProduct[]>;
}

export const catalogService: CatalogService = {
  async getProducts() {
    return [];
  },
  async getProductById() {
    return null;
  },
  async getCollections() {
    return [];
  },
  async filterProducts() {
    return [];
  },
};
