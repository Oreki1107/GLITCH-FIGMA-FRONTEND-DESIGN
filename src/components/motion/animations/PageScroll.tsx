/**
 * PageScrollAnimation
 *
 * @description
 * A living scroll-down hint that teaches exploration through continuous
 * gentle motion. It loops autonomously from the moment it mounts — the
 * parent is responsible for fading it out once the user has scrolled.
 *
 * @behaviour
 * - Loops continuously (alive by default)
 * - Disappears when the parent detects scrollY > threshold
 * - Never reappears during the session (controlled by parent state)
 *
 * @usage
 * - Hero section scroll indicator
 * - First-viewport "continue exploring" cue
 *
 * @do_not_use_for
 * - Generic navigation arrows
 * - Any context where the user is already scrolling
 *
 * @example
 * ```tsx
 * // Hero bottom scroll cue — parent fades it out after user scrolls
 * <PageScrollAnimation size={40} colorMode="accent" ariaLabel="Scroll to explore" />
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
      defaultLoop={true}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Scroll down to explore"}
    />
  );
});

PageScrollAnimation.displayName = "PageScrollAnimation";
