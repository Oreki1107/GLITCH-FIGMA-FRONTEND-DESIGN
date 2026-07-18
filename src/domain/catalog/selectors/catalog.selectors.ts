import type { CollectionModel, CatalogFiltersModel, ProductModel } from '@/domain/shared/models';

export function selectCatalogCollections(collections: CollectionModel[]) {
  return collections;
}

export function selectCatalogProducts(products: ProductModel[]) {
  return products;
}

/**
 * Select filtered products based on category and collection filters
 */
export function selectFilteredProducts(
  products: ProductModel[],
  filters: CatalogFiltersModel
): ProductModel[] {
  if (!products.length) return [];
  return products.filter(
    (product) =>
      (filters.category === 'all' || product.categoryTitle === filters.category) &&
      (filters.collection === 'all' || product.collectionTitle === filters.collection)
  );
}

/**
 * Select all available categories derived from products
 */
export function selectAvailableCategories(products: ProductModel[]): string[] {
  return Array.from(new Set(products.map((product) => product.categoryTitle))).filter(Boolean);
}

/**
 * Select products by search query across title, collection, and category
 */
export function selectProductsBySearchQuery(products: ProductModel[], query: string): ProductModel[] {
  const normalized = query.toLowerCase();
  return products.filter((product) =>
    `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
      .toLowerCase()
      .includes(normalized)
  );
}

/**
 * Select a collection by title
 */
export function selectCollectionByTitle(collections: CollectionModel[], title: string): CollectionModel | undefined {
  return collections.find((collection) => collection.title === title);
}
