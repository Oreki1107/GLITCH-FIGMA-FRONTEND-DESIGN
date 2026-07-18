/**
 * Motion System — Central Registry
 *
 * GLYCH Motion Design System
 * 
 * Exports all reusable animation components and hooks.
 * All animations are lazy-loaded by default to prevent unnecessary
 * bundle bloat. They load only when rendered (or intersected, if
 * triggerOnView is used).
 * 
 * @usage
 * ```tsx
 * import { BagArrowAnimation, useReducedMotion } from "@/components/motion";
 * // Note: Ensure the parent is wrapped in a <Suspense> boundary.
 * ```
 */

import React, { lazy } from "react";
import type { AnimationProps, AnimationControls, AnimationSize, AnimationTrigger } from "./types";

// Re-export hooks and types
export * from "./useReducedMotion";
export * from "./usePlayOnce";
export * from "./useIntersectionAnimation";
export * from "./types";
export * from "./GlychText";

// ─────────────────────────────────────────────────────────────────────────────
// Lazy-loaded Animation Components
// ─────────────────────────────────────────────────────────────────────────────

/** 
 * BagArrowAnimation
 * Transfer of an item into inventory (Add to Pocket/Cart).
 */
export const BagArrowAnimation = lazy(() => 
  import("./animations/BagArrow").then((mod) => ({ default: mod.BagArrowAnimation }))
);

/**
 * InvoiceAnimation
 * Order confirmation, receipt, or invoice generation.
 */
export const InvoiceAnimation = lazy(() => 
  import("./animations/Invoice").then((mod) => ({ default: mod.InvoiceAnimation }))
);

/**
 * MoneyAnimation
 * Successful financial event: payment, cashback, refund.
 */
export const MoneyAnimation = lazy(() => 
  import("./animations/Money").then((mod) => ({ default: mod.MoneyAnimation }))
);

/**
 * BoxOpenAnimation
 * Delivered package being opened (unboxing/delivery confirmation).
 */
export const BoxOpenAnimation = lazy(() => 
  import("./animations/BoxOpen").then((mod) => ({ default: mod.BoxOpenAnimation }))
);

/**
 * BoxLockAnimation
 * Order packing, shipment security, warehouse preparation.
 */
export const BoxLockAnimation = lazy(() => 
  import("./animations/BoxLock").then((mod) => ({ default: mod.BoxLockAnimation }))
);

/**
 * FingerGestureAnimation
 * Gesture interaction tutorial (swipe, drag, tap).
 * Important: Play once only.
 */
export const FingerGestureAnimation = lazy(() => 
  import("./animations/FingerGesture").then((mod) => ({ default: mod.FingerGestureAnimation }))
);

/**
 * SliderArrowAnimation
 * Directional hint for carousels and horizontal scroll.
 * Important: Hint only. Do not loop infinitely.
 */
export const SliderArrowAnimation = lazy(() => 
  import("./animations/SliderArrow").then((mod) => ({ default: mod.SliderArrowAnimation }))
);

/**
 * PageScrollAnimation
 * Scroll-down hint for long pages or onboarding.
 * Important: Play once only.
 */
export const PageScrollAnimation = lazy(() => 
  import("./animations/PageScroll").then((mod) => ({ default: mod.PageScrollAnimation }))
);
