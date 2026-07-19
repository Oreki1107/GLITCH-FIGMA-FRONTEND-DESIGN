/**
 * ScrollToAnimation
 *
 * @description
 * Footer return-to-top guidance loop. Encourages upward exploration.
 *
 * @usage
 * - Footer return to top hint
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/scroll-to.json";

export const ScrollToAnimation = React.memo(function ScrollToAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={true}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "Return to top"}
    />
  );
});

ScrollToAnimation.displayName = "ScrollToAnimation";
