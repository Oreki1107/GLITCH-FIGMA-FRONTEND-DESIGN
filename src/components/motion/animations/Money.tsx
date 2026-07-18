/**
 * MoneyAnimation
 *
 * @description
 * Represents a successful financial event: payment, cashback, refund, or credit.
 * Communicates a positive monetary outcome to the user.
 *
 * @usage
 * - Payment success confirmation
 * - Wallet top-up confirmation
 * - Cashback or refund notification
 * - Credit applied confirmation
 * - Transaction receipt
 *
 * @do_not_use_for
 * - Product browsing or discovery
 * - Cart interactions (use BagArrowAnimation)
 * - General loading states
 *
 * @example
 * ```tsx
 * // Payment success modal
 * <MoneyAnimation size={96} playOnce autoplay ariaLabel="Payment successful" />
 *
 * // Refund confirmation
 * <MoneyAnimation size={64} triggerOnView playOnce onComplete={() => console.log("done")} />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/money.json";

export const MoneyAnimation = React.memo(function MoneyAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Payment or financial transaction animation"}
    />
  );
});

MoneyAnimation.displayName = "MoneyAnimation";
