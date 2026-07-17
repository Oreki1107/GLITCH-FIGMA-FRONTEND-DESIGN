import type { CollectionModel, ProductModel } from '@/domain/shared/models';
import type { CatalogFiltersModel } from '@/domain/shared/models';
import { catalogRepository } from '../repositories/catalog.repository';

export interface CatalogService {
  getProducts(): Promise<ProductModel[]>;
  getProductById(id: string): Promise<ProductModel | null>;
  getProductsByIds(ids: string[]): Promise<ProductModel[]>;
  getCollections(): Promise<CollectionModel[]>;
  getCollectionByHandle(handle: string): Promise<CollectionModel | null>;
  filterProducts(filters: CatalogFiltersModel): Promise<ProductModel[]>;
  getCategories(): Promise<string[]>;
}

export const catalogService: CatalogService = {
  async getProducts() {
    return catalogRepository.getProducts();
  },
  async getProductById(id) {
    return catalogRepository.getProductById(id);
  },
  async getProductsByIds(ids) {
    return catalogRepository.getProductsByIds(ids);
  },
  async getCollections() {
    return catalogRepository.getCollections();
  },
  async getCollectionByHandle(handle) {
    return catalogRepository.getCollectionByHandle(handle);
  },
  async filterProducts(filters) {
    return catalogRepository.filterProducts(filters);
  },
  async getCategories() {
    return catalogRepository.getCategories();
  },
};
