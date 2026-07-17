import type { CollectionModel, ProductModel } from "@/domain/shared/models";

export function productsByIds(products: ProductModel[], ids?: string[]): ProductModel[] {
  return (ids ?? [])
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is ProductModel => Boolean(product));
}

export function collectionsByHandles(
  collections: CollectionModel[],
  handles?: string[],
): CollectionModel[] {
  return (handles ?? [])
    .map((handle) => collections.find((collection) => collection.handle === handle))
    .filter((collection): collection is CollectionModel => Boolean(collection));
}

export function deriveCategories(products: ProductModel[]): string[] {
  return Array.from(new Set(products.map((product) => product.categoryTitle))).filter(Boolean);
}

export function filterProducts(
  products: ProductModel[],
  category: string,
  collection: string,
): GlitchProduct[] {
  return products.filter(
    (product) =>
      (category === "all" || product.categoryTitle === category) &&
      (collection === "all" || product.collectionTitle === collection),
  );
}

export function searchProducts(products: ProductModel[], query: string): ProductModel[] {
  const normalized = query.toLowerCase();
  return products.filter((product) =>
    `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
      .toLowerCase()
      .includes(normalized),
  );
}
