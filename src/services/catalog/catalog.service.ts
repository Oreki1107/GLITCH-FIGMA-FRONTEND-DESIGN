import type { GlitchCollection, GlitchProduct } from "@/domain/types";
import type { CatalogFilters } from "@/domain/types/navigation";

export type ICatalogService = {
  getProducts(): Promise<GlitchProduct[]>;
  getProductById(id: string): Promise<GlitchProduct | null>;
  getProductsByIds(ids: string[]): Promise<GlitchProduct[]>;
  getCollections(): Promise<GlitchCollection[]>;
  getCollectionByHandle(handle: string): Promise<GlitchCollection | null>;
  filterProducts(filters: CatalogFilters): Promise<GlitchProduct[]>;
  getCategories(): Promise<string[]>;
};
