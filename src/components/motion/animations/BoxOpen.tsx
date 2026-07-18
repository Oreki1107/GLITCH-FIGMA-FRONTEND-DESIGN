/**
 * BoxOpenAnimation
 *
 * @description
 * Represents a delivered package being opened by the customer.
 * The ideal animation for delivery confirmation and unboxing moments.
 *
 * @usage
 * - "Your order has been delivered" confirmation
 * - Package opened / received state
 * - Order received celebration
 * - Unboxing experience screen
 *
 * @do_not_use_for
 * - Shipping preparation states (use BoxLockAnimation)
 * - Order placement (use InvoiceAnimation)
 * - Cart or product interactions
 *
 * @example
 * ```tsx
 * // Delivery confirmation screen
 * <BoxOpenAnimation size={128} playOnce triggerOnView ariaLabel="Package delivered" />
 *
 * // With custom dimensions
 * <BoxOpenAnimation width={200} height={200} autoplay loop={false} />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/box-open.json";

export const BoxOpenAnimation = React.memo(function BoxOpenAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Package delivered and opened"}
    />
  );
});

BoxOpenAnimation.displayName = "BoxOpenAnimation";
