import type { ProductPresentation } from "@/domain/types";

export const mockProductPresentations: ProductPresentation[] = [
  { productId: "1", tone: "from-[#303638] to-[#0c0d0e]", wide: true },
  { productId: "2", tone: "from-[#5f4d49] to-[#151214]" },
  { productId: "3", tone: "from-[#344039] to-[#101311]" },
  { productId: "4", tone: "from-[#132335] to-[#0a0b0e]", wide: true },
  { productId: "5", tone: "from-[#2a2d33] to-[#121217]" },
  { productId: "6", tone: "from-[#3c3231] to-[#151112]" },
  { productId: "7", tone: "from-[#253034] to-[#101314]" },
  { productId: "8", tone: "from-[#303238] to-[#0d0e12]" },
];

export function presentationMap(presentations: ProductPresentation[]) {
  return new Map(presentations.map((item) => [item.productId, item]));
}

export function getPresentation(
  presentations: Map<string, ProductPresentation>,
  productId: string,
): ProductPresentation {
  return presentations.get(productId) ?? { productId, tone: "from-[#303638] to-[#0c0d0e]" };
}
