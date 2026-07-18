/**
 * BoxLockAnimation
 *
 * @description
 * Represents order packing, shipment security, and warehouse preparation.
 * Communicates that an order is being handled and secured for shipping.
 *
 * @usage
 * - "Order packed" confirmation
 * - Shipment secured notification
 * - Warehouse dispatch confirmation
 * - Shipping label created feedback
 * - Trust / security indicators
 *
 * @do_not_use_for
 * - Delivery confirmation (use BoxOpenAnimation)
 * - Payment confirmation (use MoneyAnimation)
 * - Order placement (use InvoiceAnimation)
 *
 * @example
 * ```tsx
 * // Order packing confirmation
 * <BoxLockAnimation size={96} playOnce triggerOnView ariaLabel="Order secured for shipping" />
 *
 * // Security badge on checkout
 * <BoxLockAnimation size={32} autoplay={false} />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/box-lock.json";

export const BoxLockAnimation = React.memo(function BoxLockAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Order packed and secured for shipping"}
    />
  );
});

BoxLockAnimation.displayName = "BoxLockAnimation";
