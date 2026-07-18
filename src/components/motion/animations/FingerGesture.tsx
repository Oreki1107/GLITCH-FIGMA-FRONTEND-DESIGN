/**
 * FingerGestureAnimation
 *
 * @description
 * Teaches the user a gesture interaction: swipe, drag, or tap.
 * This is a purely instructional animation. It must only appear during
 * first-time user onboarding or when introducing a new gesture.
 *
 * @usage
 * - Teach horizontal swipe on product carousel (first visit)
 * - Introduce drag-to-reorder interaction
 * - Guide tap interaction on image gallery
 *
 * @do_not_use_for
 * - Persistent or decorative animation
 * - Repeated display (should only show once per user)
 * - Generic loading or confirmation states
 *
 * @important
 * Always pair with `playOnce`. Never use `loop={true}` for this animation.
 * This animation should never become a permanent looping UI element.
 *
 * @example
 * ```tsx
 * // First-visit swipe tutorial on carousel
 * <FingerGestureAnimation size={64} playOnce triggerOnView ariaLabel="Swipe to explore" />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/finger-up.json";

export const FingerGestureAnimation = React.memo(function FingerGestureAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      // Always enforced as play-once; this animation must never loop indefinitely
      defaultLoop={false}
      defaultAutoplay={false}
      ariaLabel={props.ariaLabel ?? "Swipe or tap gesture tutorial"}
    />
  );
});

FingerGestureAnimation.displayName = "FingerGestureAnimation";
