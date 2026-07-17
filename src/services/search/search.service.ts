import type { GlitchProduct } from "@/domain/types";

export type ISearchService = {
  search(query: string): Promise<GlitchProduct[]>;
};
