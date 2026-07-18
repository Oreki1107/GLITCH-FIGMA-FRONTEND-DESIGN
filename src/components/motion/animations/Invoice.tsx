/**
 * InvoiceAnimation
 *
 * @description
 * Represents an order confirmation, receipt, or invoice being generated.
 * Used to signal the completion of a financial or order transaction.
 *
 * @usage
 * - Order confirmed screen
 * - Invoice generated confirmation
 * - Purchase history summary
 * - Receipt generation feedback
 *
 * @do_not_use_for
 * - Loading states
 * - Product browsing
 * - Cart state (use BagArrowAnimation instead)
 *
 * @example
 * ```tsx
 * // Order confirmed — play once on mount
 * <InvoiceAnimation size={96} playOnce autoplay ariaLabel="Order confirmed" />
 *
 * // Trigger when confirmation scrolls into view
 * <InvoiceAnimation size={64} triggerOnView playOnce />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/invoice.json";

export const InvoiceAnimation = React.memo(function InvoiceAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Invoice or order confirmation"}
    />
  );
});

InvoiceAnimation.displayName = "InvoiceAnimation";
