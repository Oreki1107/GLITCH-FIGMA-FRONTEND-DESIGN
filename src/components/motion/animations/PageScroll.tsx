/**
 * PageScrollAnimation
 *
 * @description
 * A gentle scroll-down hint animation. Encourages the user to continue
 * scrolling or exploring a long page. Ideal for onboarding moments at
 * the bottom of a hero section.
 *
 * @usage
 * - Hero section scroll indicator
 * - "Continue exploring" cue at page bottom of first view
 * - Long page onboarding where the next section is important
 *
 * @do_not_use_for
 * - Generic navigation arrows
 * - Persistent or permanent looping animation
 * - Any context where the user is already aware of scrolling
 *
 * @important
 * This animation must always use `playOnce`. Infinite loops are attention-
 * stealing and violate GLYCH's motion design principles.
 *
 * @example
 * ```tsx
 * // Hero bottom scroll cue
 * <PageScrollAnimation size={48} triggerOnView playOnce ariaLabel="Scroll to explore" />
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/page-scroll.json";

export const PageScrollAnimation = React.memo(function PageScrollAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={false}
      ariaLabel={props.ariaLabel ?? "Scroll down to continue"}
    />
  );
});

PageScrollAnimation.displayName = "PageScrollAnimation";
