import type { GlitchCollection, GlitchProduct } from "@/domain/types";

export function productsByIds(products: GlitchProduct[], ids?: string[]): GlitchProduct[] {
  return (ids ?? [])
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is GlitchProduct => Boolean(product));
}

export function collectionsByHandles(
  collections: GlitchCollection[],
  handles?: string[],
): GlitchCollection[] {
  return (handles ?? [])
    .map((handle) => collections.find((collection) => collection.handle === handle))
    .filter((collection): collection is GlitchCollection => Boolean(collection));
}

export function deriveCategories(products: GlitchProduct[]): string[] {
  return Array.from(new Set(products.map((product) => product.categoryTitle))).filter(Boolean);
}

export function filterProducts(
  products: GlitchProduct[],
  category: string,
  collection: string,
): GlitchProduct[] {
  return products.filter(
    (product) =>
      (category === "all" || product.categoryTitle === category) &&
      (collection === "all" || product.collectionTitle === collection),
  );
}

export function searchProducts(products: GlitchProduct[], query: string): GlitchProduct[] {
  const normalized = query.toLowerCase();
  return products.filter((product) =>
    `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
      .toLowerCase()
      .includes(normalized),
  );
}
