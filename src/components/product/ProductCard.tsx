import type { ProductModel } from "@/domain/shared/models";
import type { ProductPresentation } from "@/domain/types";
import { SystemLabel } from "@/components/primitives";

type ProductCardProps = {
  product: GlitchProduct;
  presentation: ProductPresentation;
  index?: number;
  onOpen: () => void;
  compact?: boolean;
  expanded?: boolean;
};

export function ProductCard({
  product,
  presentation,
  index = 0,
  onOpen,
  compact = false,
  expanded = false,
}: ProductCardProps) {
  const specs = `${product.tag} / flexible object specification`;

  return (
    <article
      data-card-state={expanded ? "expanded" : "resting"}
      className={`group relative min-w-0 ${presentation.wide && !compact ? "md:col-span-2" : ""} ${index === 1 && !compact ? "md:mt-16" : ""}`}
    >
      <button
        onClick={onOpen}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${presentation.tone} ${compact ? "aspect-[.8]" : presentation.wide ? "aspect-[1.22/1]" : "aspect-[.83/1]"}`}
        >
          <img
            src={product.imageUrl}
            alt={`${product.title} on a model`}
            className="size-full object-cover grayscale-[18%] transition duration-500 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 border border-white/25 bg-black/25 px-2 py-1 backdrop-blur-sm">
            <SystemLabel>{product.tag}</SystemLabel>
          </div>
          <div className="absolute bottom-3 left-3 hidden items-center gap-2 md:flex">
            <span className="size-2 bg-primary" />
            <SystemLabel>hold / inspect</SystemLabel>
          </div>
        </div>
        <div className="flex items-start justify-between gap-3 py-3">
          <div>
            <h3 className="text-[13px] font-semibold lowercase tracking-[-0.02em]">{product.title}</h3>
            <SystemLabel className="text-muted-foreground">{product.collectionTitle}</SystemLabel>
          </div>
          <SystemLabel>{product.price.formatted}</SystemLabel>
        </div>
        {expanded && (
          <div className="border-t border-border pb-3 pt-3" data-future-interaction="long-press-peek">
            <div className="flex items-center justify-between">
              <SystemLabel className="text-primary">peek state / future long press</SystemLabel>
              <SystemLabel>01 / 05</SystemLabel>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex gap-1">
                <span className="size-3 border border-white/30 bg-[#18181b]" />
                <span className="size-3 border border-white/30 bg-[#69716b]" />
                <span className="size-3 border border-white/30 bg-[#6b4549]" />
              </div>
              <SystemLabel>signal rating / 4.8</SystemLabel>
            </div>
            <SystemLabel className="mt-3 block text-muted-foreground">{specs}</SystemLabel>
          </div>
        )}
      </button>
    </article>
  );
}
