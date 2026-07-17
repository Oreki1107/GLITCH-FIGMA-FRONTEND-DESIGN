import type { GlitchCartLine, GlitchProduct } from "@/domain/types";

export type ICartService = {
  getLines(): Promise<GlitchCartLine[]>;
  addLine(product: GlitchProduct, size: string, quantity: number): Promise<void>;
  removeLine(lineId: string): Promise<void>;
  clear(): Promise<void>;
};
