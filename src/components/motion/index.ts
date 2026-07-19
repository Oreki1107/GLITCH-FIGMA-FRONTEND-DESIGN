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
 * ─── Responsibility Matrix ───────────────────────────────────────────────────
 *
 * GlychText
 *   Identity typography only: hero h1, brand names (nav, footer),
 *   future editorial slogans and campaign statements.
 *   NEVER on: product names, prices, buttons, labels, cards, metadata.
 *
 * BagArrowAnimation
 *   Permanent responsibility: item transfer into the user's inventory.
 *   Use in: Hero CTA "move to pocket", Pocket interaction, product transfer,
 *   add-to-pocket confirmation, wishlist transfer.
 *   NEVER as: generic navigation or unrelated affordance.
 *
 * SliderArrowAnimation
 *   Permanent responsibility: teaching horizontal exploration.
 *   Use in: horizontal product carousels, collection sliders,
 *   gallery browsing, swipeable sections.
 *   Reduce or remove after user interacts successfully.
 *
 * FingerGestureAnimation
 *   Permanent responsibility: introducing a gesture.
 *   Use in: first horizontal carousel, first drag/swipe interaction,
 *   first-time onboarding moments.
 *   NEVER display permanently. Play once, then remove.
 *
 * PageScrollAnimation
 *   Superseded by ScrollDownAnimation. Retained for backwards compatibility
 *   in legacy prototypes, but unused in production Homepage.
 *
 * ScrollDownAnimation
 *   Permanent responsibility: teaching the user to explore vertically from Hero.
 *   Loops autonomously. Starts after Hero Camera settles. Restores on re-entry.
 *
 * ScrollingAnimation
 *   Permanent responsibility: Footer completion acknowledgement.
 *   Plays exactly once per session on first footer arrival. Never loops.
 *
 * ScrollToAnimation
 *   Permanent responsibility: Footer return-to-top guidance.
 *   Loops continuously while footer is active. Fades gracefully on exit.
 *
 * MoneyAnimation
 *   Reserved — do not integrate until frontend experience exists.
 *   Future use: payment success, wallet, cashback, refund.
 *
 * InvoiceAnimation
 *   Reserved — do not integrate until frontend experience exists.
 *   Future use: order confirmation, receipt, purchase summary.
 *
 * BoxLockAnimation
 *   Reserved — do not integrate until frontend experience exists.
 *   Future use: order packed, shipment secured, processing complete.
 *
 * BoxOpenAnimation
 *   Reserved — do not integrate until frontend experience exists.
 *   Future use: delivery completed, package opened, unboxing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
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
 * Use in: Hero CTA, Pocket interaction, product transfer, add-to-pocket confirmation.
 * Never use as generic navigation.
 */
export const BagArrowAnimation = lazy(() => 
  import("./animations/BagArrow").then((mod) => ({ default: mod.BagArrowAnimation }))
);

/**
 * InvoiceAnimation
 * Reserved: order confirmation, receipt, or invoice generation.
 * Do not display until those frontend experiences exist.
 */
export const InvoiceAnimation = lazy(() => 
  import("./animations/Invoice").then((mod) => ({ default: mod.InvoiceAnimation }))
);

/**
 * MoneyAnimation
 * Reserved: payment success, cashback, refund, wallet.
 * Do not display until those frontend experiences exist.
 */
export const MoneyAnimation = lazy(() => 
  import("./animations/Money").then((mod) => ({ default: mod.MoneyAnimation }))
);

/**
 * BoxOpenAnimation
 * Reserved: delivery completed, package opened, unboxing.
 * Do not display until those frontend experiences exist.
 */
export const BoxOpenAnimation = lazy(() => 
  import("./animations/BoxOpen").then((mod) => ({ default: mod.BoxOpenAnimation }))
);

/**
 * BoxLockAnimation
 * Reserved: order packed, shipment secured, processing complete.
 * Do not display until those frontend experiences exist.
 */
export const BoxLockAnimation = lazy(() => 
  import("./animations/BoxLock").then((mod) => ({ default: mod.BoxLockAnimation }))
);

/**
 * FingerGestureAnimation
 * Introduces a gesture interaction (swipe, drag, tap).
 * Play once only on first encounter. Never display permanently.
 * Use in: first horizontal carousel, first drag interaction, onboarding.
 */
export const FingerGestureAnimation = lazy(() => 
  import("./animations/FingerGesture").then((mod) => ({ default: mod.FingerGestureAnimation }))
);

/**
 * SliderArrowAnimation
 * Teaches horizontal exploration in carousels and sliders.
 * Reduce or remove after user interacts successfully.
 * Use in: product carousels, collection sliders, gallery browsing.
 */
export const SliderArrowAnimation = lazy(() => 
  import("./animations/SliderArrow").then((mod) => ({ default: mod.SliderArrowAnimation }))
);

/**
 * ScrollDownAnimation
 * Teaches vertical exploration from the Hero. Tied to Hero Camera settling.
 */
export const ScrollDownAnimation = lazy(() => 
  import("./animations/ScrollDown").then((mod) => ({ default: mod.ScrollDownAnimation }))
);

/**
 * ScrollingAnimation
 * Footer completion acknowledgement. Plays once per session.
 */
export const ScrollingAnimation = lazy(() => 
  import("./animations/Scrolling").then((mod) => ({ default: mod.ScrollingAnimation }))
);

/**
 * ScrollToAnimation
 * Footer return-to-top guidance. Loops while footer is active.
 */
export const ScrollToAnimation = lazy(() => 
  import("./animations/ScrollTo").then((mod) => ({ default: mod.ScrollToAnimation }))
);

/**
 * PageScrollAnimation
 * Superseded by ScrollDownAnimation.
 */
export const PageScrollAnimation = lazy(() => 
  import("./animations/PageScroll").then((mod) => ({ default: mod.PageScrollAnimation }))
);
