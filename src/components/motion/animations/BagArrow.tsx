/**
 * BagArrowAnimation
 *
 * @description
 * Represents the transfer of an item into the user's inventory (pocket/cart).
 * Used for "Add to Pocket", "Add to Cart", and product transfer interactions.
 *
 * @usage
 * - Add to Cart / Pocket button feedback
 * - Wishlist item movement
 * - Product transfer confirmation
 *
 * @do_not_use_for
 * - Generic loading states
 * - Navigation indicators
 * - Page transitions
 *
 * @example
 * ```tsx
 * // Play once on "Add to Pocket" confirmation
 * <BagArrowAnimation size={48} playOnce autoplay ariaLabel="Item added to pocket" />
 *
 * // Trigger on view with imperative control
 * const ref = useRef<AnimationControls>(null);
 * <BagArrowAnimation size={64} triggerOnView controlRef={ref} />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/bag-arrow.json";

export const BagArrowAnimation = React.memo(function BagArrowAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Item being added to pocket"}
    />
  );
});

BagArrowAnimation.displayName = "BagArrowAnimation";
