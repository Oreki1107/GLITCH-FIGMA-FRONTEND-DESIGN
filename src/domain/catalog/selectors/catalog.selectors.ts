import type { GlitchCollection, GlitchProduct } from '@/domain/types';

export function selectCatalogCollections(collections: GlitchCollection[]) {
  return collections;
}

export function selectCatalogProducts(products: GlitchProduct[]) {
  return products;
}
