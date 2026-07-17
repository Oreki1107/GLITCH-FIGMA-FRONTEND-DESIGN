import type { CollectionModel, ProductModel } from '@/domain/shared/models';

export function selectCatalogCollections(collections: CollectionModel[]) {
  return collections;
}

export function selectCatalogProducts(products: ProductModel[]) {
  return products;
}
