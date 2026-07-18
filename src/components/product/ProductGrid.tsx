/**
 * ProductGrid
 * Renders a responsive product grid with staggered entrance animation.
 *
 * Animation behavior:
 * - On mount: cards stagger in from below (cardEnter)
 * - On items change (filter/search): re-runs entrance stagger
 *   to signal the grid has new content
 * - Reduced motion: animation instantly completes (GSAP globalTimeline.timeScale(0))
 *
 * Architecture:
 * - Passes ProductCardCallbacks down to each ProductCard.
 * - No business logic. No filtering. No state.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { ProductModel } from "@/domain/shared/models";
import type { ProductPresentation } from "@/domain/types";
import { getPresentation } from "@/data/mock";
import { EmptyState } from "@/components/layout/EmptyState";
import { ProductCard, type ProductCardCallbacks } from "./ProductCard";
import { cardEnter, createGridInertia } from "@/animations/gsap/timelines/productCardAnimations";

type ProductGridProps = Omit<ProductCardCallbacks, 'isWishlisted'> & {
  items: ProductModel[];
  presentations: Map<string, ProductPresentation>;
  onOpen: (product: ProductModel) => void;
  expandedIndex?: number | null;
  isWishlisted?: (id: string) => boolean;
};

export function ProductGrid({
  items,
  presentations,
  onOpen,
  expandedIndex = null,
  onWishlistToggle,
  onQuickAdd,
  isWishlisted,
}: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Re-run entrance animation whenever the items list changes.
  // Dependency on items.length + first item id gives us stable identity.
  const itemKey = items.length > 0 ? `${items.length}-${items[0].id}` : "empty";

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      // Apply scroll velocity inertia to the entire grid
      createGridInertia(grid);

      if (items.length === 0) return;

      const cards = grid.querySelectorAll("article[data-card-state]");
      if (cards.length === 0) return;

      cardEnter(cards);
    },
    {
      scope: gridRef,
      dependencies: [itemKey],
      revertOnUpdate: false,
    },
  );

  if (!items.length) {
    return (
      <EmptyState
        kicker="no objects in this edit"
        description="This layout stays ready when a collection is waiting for its first object."
      />
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4 xl:gap-x-7"
    >
      {items.map((item, index) => (
        <ProductCard
          key={item.id}
          product={item}
          presentation={getPresentation(presentations, item.id)}
          index={index}
          onOpen={() => onOpen(item)}
          expanded={expandedIndex === index}
          onWishlistToggle={onWishlistToggle}
          onQuickAdd={onQuickAdd}
          isWishlisted={isWishlisted?.(item.id) ?? false}
        />
      ))}
    </div>
  );
}
