/**
 * ProductCard
 * Complete behavioral model for a product card.
 *
 * Interaction systems:
 * 1. Cursor-aware image depth (useHoverDepth) — image shifts toward cursor
 * 2. Wishlist affordance — Heart icon, opacity-0 → opacity-100 on hover
 * 3. Quick-add affordance — "+" button at card bottom, appears on hover
 * 4. Full card press feedback — active:scale-[.98] on the article
 * 5. Image scale on hover — existing behavior preserved
 * 6. Focus-visible ring — keyboard accessible
 * 7. Touch device adaptations — hover affordances hidden on touch
 * 8. Reduced-motion respect — CSS transitions collapse via global CSS override
 *
 * Architecture:
 * - Zero business logic. All interactions are surfaced via optional props.
 * - onWishlistToggle / onQuickAdd are optional — card degrades gracefully.
 * - All data reading through existing ProductModel / ProductPresentation types.
 */
import { useRef } from "react";
import { Heart, Plus } from "lucide-react";
import type { ProductModel } from "@/domain/shared/models";
import type { ProductPresentation } from "@/domain/types";
import { SystemLabel } from "@/components/primitives";
import { useHoverDepth } from "@/hooks/ui/useHoverDepth";
import { useGSAP } from "@gsap/react";
import { createAmbientBreathing } from "@/animations/gsap/timelines/productCardAnimations";

/** Callbacks that parent components thread down from their action handlers */
export interface ProductCardCallbacks {
  /** Called when the wishlist toggle is clicked. id = product.id */
  onWishlistToggle?: (id: string) => void;
  /** Called when the quick-add button is clicked. Passes full product for inventory overlay. */
  onQuickAdd?: (product: ProductModel) => void;
  /** Whether this product is in the wishlist (controls icon fill state) */
  isWishlisted?: boolean;
}

type ProductCardProps = ProductCardCallbacks & {
  product: ProductModel;
  presentation: ProductPresentation;
  index?: number;
  onOpen: () => void;
  compact?: boolean;
  expanded?: boolean;
};

/** Max image parallax offset in pixels */
const DEPTH_OFFSET = 8;

export function ProductCard({
  product,
  presentation,
  index = 0,
  onOpen,
  compact = false,
  expanded = false,
  onWishlistToggle,
  onQuickAdd,
  isWishlisted = false,
}: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { x, y, isHovering, isAware, proximity, isCentered } = useHoverDepth(cardRef);

  const specs = `${product.tag} / flexible object specification`;

  // Base scale is 1.04.
  // Aware state: very slightly pushes forward based on proximity (max 1.06).
  // Hover state: Retreats back to 1.0 (physical separation).
  let targetScale = 1.04;
  if (isHovering) targetScale = 1.0;
  else if (isAware) targetScale = 1.04 + (proximity * 0.02);

  // Material response (Grayscale)
  // Resting = 18%. Aware = reduces slightly. Hover = 0%.
  let grayscale = 18;
  if (isHovering) grayscale = 0;
  else if (isAware) grayscale = Math.max(0, 18 - (proximity * 10));

  // Compute image parallax transform based on cursor position
  const imageDepthStyle = {
    transform: `translate3d(${x * DEPTH_OFFSET}px, ${y * DEPTH_OFFSET}px, 0) scale(${targetScale})`,
    filter: `grayscale(${grayscale}%)`,
    transition: isHovering || isAware
      ? "transform 0.1s linear, filter 0.15s linear"
      : "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.45s ease-out",
  };

  useGSAP(() => {
    // Ambient breathing: Only on cards receiving attention (expanded or centered)
    // and ONLY when not receiving direct user interaction (aware/hover).
    if (imageWrapperRef.current && (expanded || isCentered) && !isHovering && !isAware) {
      createAmbientBreathing(imageWrapperRef.current);
    }
  }, { dependencies: [expanded, isCentered, isHovering, isAware], scope: cardRef });

  return (
    <article
      ref={cardRef}
      data-card-state={expanded ? "expanded" : "resting"}
      className={`group relative min-w-0 active:scale-[.98] transition-transform duration-100
        ${presentation.wide && !compact ? "md:col-span-2" : ""}
        ${index === 1 && !compact ? "md:mt-16" : ""}
      `}
    >
      {/* ── Wishlist affordance ─────────────────────────────────────────────
          Visible on hover only. Hidden on touch devices via CSS.
          Calls onWishlistToggle — no business logic here.
      ──────────────────────────────────────────────────────────────────── */}
      {onWishlistToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={isWishlisted}
          className={`absolute right-3 top-3 z-10 grid size-8 place-items-center border backdrop-blur-sm transition-all duration-200
            hover:scale-110 active:scale-95
            md:opacity-0 md:group-hover:opacity-100
            ${isWishlisted
              ? "border-primary bg-primary/20 text-primary"
              : "border-white/25 bg-black/25 text-white"
            }
          `}
        >
          <Heart
            size={14}
            fill={isWishlisted ? "currentColor" : "none"}
            className="transition-all duration-200"
          />
        </button>
      )}

      <button
        onClick={onOpen}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        aria-label={`View ${product.title}, ${product.price.formatted}`}
      >
        {/* ── Image container ───────────────────────────────────────────────
            Overflow hidden keeps parallax within bounds.
            The image itself receives the depth transform.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${presentation.tone}
            ${compact ? "aspect-[.8]" : presentation.wide ? "aspect-[1.22/1]" : "aspect-[.83/1]"}
          `}
        >
          <div ref={imageWrapperRef} className="absolute inset-0 size-full">
            <img
              src={product.imageUrl}
              alt={`${product.title} on a model`}
              className="size-full object-cover gpu-accelerated"
              style={imageDepthStyle}
            />
          </div>
          {/* Gradient overlay — preserved from original */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {/* Product tag — top left */}
          <div className="absolute left-3 top-3 border border-white/25 bg-black/25 px-2 py-1 backdrop-blur-sm">
            <SystemLabel>{product.tag}</SystemLabel>
          </div>

          {/* Signal indicator — bottom left, desktop only */}
          <div className="absolute bottom-3 left-3 hidden items-center gap-2 md:flex">
            <span className="size-2 bg-primary" />
            <SystemLabel>hold / inspect</SystemLabel>
          </div>

          {/* ── Quick-add affordance ────────────────────────────────────────
              Slides up from bottom on hover. Desktop only.
              Calls onQuickAdd — no business logic here.
          ─────────────────────────────────────────────────────────────────*/}
          {onQuickAdd && (
            <div
              className={`absolute bottom-0 left-0 right-0 hidden md:flex items-center justify-between px-3 py-2
                border-t border-primary bg-background/90 backdrop-blur-sm
                transition-all duration-300 ease-out
                ${isHovering ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
              `}
            >
              <SystemLabel className="text-primary">move to pocket</SystemLabel>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product);
                }}
                aria-label={`Quick add ${product.title} to inventory`}
                className="grid size-7 place-items-center border border-primary bg-primary text-primary-foreground
                  hover:opacity-90 active:scale-90 transition-all duration-100"
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ── Product metadata & Progressive Disclosure ───────────────────── */}
        <div 
          className="relative z-10 flex flex-col justify-start bg-background py-3 transition-transform duration-300 ease-out"
          style={{ transform: isHovering ? 'translateY(-6px)' : 'translateY(0)' }}
        >
          <div className="flex items-start justify-between gap-3 bg-background">
            <div>
              <h3 className="text-[13px] font-semibold lowercase tracking-[-0.02em]">
                {product.title}
              </h3>
              <SystemLabel className="text-muted-foreground">{product.collectionTitle}</SystemLabel>
            </div>
            <SystemLabel>{product.price.formatted}</SystemLabel>
          </div>
          
          <div 
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{ 
              height: isHovering ? '1.5rem' : '0px', 
              opacity: isHovering ? 1 : 0,
              marginTop: isHovering ? '0.25rem' : '0px' 
            }}
          >
            <SystemLabel className="text-primary">{specs}</SystemLabel>
          </div>
        </div>

        {/* ── Expanded peek state ───────────────────────────────────────── */}
        {expanded && (
          <div
            className="border-t border-border pb-3 pt-3"
            data-future-interaction="long-press-peek"
          >
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
