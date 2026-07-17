import type { ProductModel } from "@/domain/shared/models";
import type { ProductPresentation } from "@/domain/types";
import { getPresentation } from "@/data/mock";
import { EmptyState } from "@/components/layout/EmptyState";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  items: ProductModel[];
  presentations: Map<string, ProductPresentation>;
  onOpen: (product: GlitchProduct) => void;
  expandedIndex?: number | null;
};

export function ProductGrid({
  items,
  presentations,
  onOpen,
  expandedIndex = null,
}: ProductGridProps) {
  if (!items.length) {
    return (
      <EmptyState
        kicker="no objects in this edit"
        description="This layout stays ready when a collection is waiting for its first object."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4 xl:gap-x-7">
      {items.map((item, index) => (
        <ProductCard
          key={item.id}
          product={item}
          presentation={getPresentation(presentations, item.id)}
          index={index}
          onOpen={() => onOpen(item)}
          expanded={expandedIndex === index}
        />
      ))}
    </div>
  );
}
