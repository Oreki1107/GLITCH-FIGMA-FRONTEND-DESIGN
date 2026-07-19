/**
 * ScrollDownAnimation
 *
 * @description
 * Hero scroll invitation. Tied to the Hero choreography and wakes up naturally
 * after the Hero Camera settles.
 *
 * @usage
 * - Hero section scroll indicator
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/scroll-down.json";

export const ScrollDownAnimation = React.memo(function ScrollDownAnimation(props: AnimationProps) {
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

ScrollDownAnimation.displayName = "ScrollDownAnimation";
