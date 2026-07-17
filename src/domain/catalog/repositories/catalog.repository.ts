import { mockProducts, mockCollections } from '@/data/mock';
import type { CollectionModel, ProductModel } from '@/domain/shared/models';
import type { CatalogFiltersModel } from '@/domain/shared/models';

export interface CatalogRepository {
  getProducts(): Promise<ProductModel[]>;
  getProductById(id: string): Promise<ProductModel | null>;
  getProductsByIds(ids: string[]): Promise<ProductModel[]>;
  getCollections(): Promise<CollectionModel[]>;
  getCollectionByHandle(handle: string): Promise<CollectionModel | null>;
  filterProducts(filters: CatalogFiltersModel): Promise<ProductModel[]>;
  getCategories(): Promise<string[]>;
}

export const catalogRepository: CatalogRepository = {
  async getProducts() {
    return mockProducts;
  },
  async getProductById(id) {
    return mockProducts.find((product) => product.id === id) ?? null;
  },
  async getProductsByIds(ids) {
    return mockProducts.filter((product) => ids.includes(product.id));
  },
  async getCollections() {
    return mockCollections;
  },
  async getCollectionByHandle(handle) {
    return mockCollections.find((collection) => collection.handle === handle) ?? null;
  },
  async filterProducts(filters) {
    return mockProducts.filter(
      (product) =>
        (filters.category === 'all' || product.categoryTitle === filters.category) &&
        (filters.collection === 'all' || product.collectionTitle === filters.collection),
    );
  },
  async getCategories() {
    return Array.from(new Set(mockProducts.map((product) => product.categoryTitle))).filter(Boolean);
  },
};
