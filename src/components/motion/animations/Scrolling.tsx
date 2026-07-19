/**
 * ScrollingAnimation
 *
 * @description
 * Footer completion acknowledgement. Plays exactly once per session.
 *
 * @usage
 * - First arrival at footer
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/scrolling.json";

export const ScrollingAnimation = React.memo(function ScrollingAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={true}
      ariaLabel={props.ariaLabel ?? "You've reached the end"}
    />
  );
});

ScrollingAnimation.displayName = "ScrollingAnimation";
