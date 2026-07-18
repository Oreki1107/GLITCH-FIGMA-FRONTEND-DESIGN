/**
 * SliderArrowAnimation
 *
 * @description
 * A directional hint animation for product carousels, galleries, and
 * horizontal scroll containers. Communicates that the user can swipe
 * or scroll horizontally.
 *
 * @usage
 * - Product carousel swipe hint
 * - Collection slider navigation indicator
 * - Image gallery scroll cue
 * - Category horizontal scroll hint
 *
 * @do_not_use_for
 * - General page navigation arrows
 * - Back/forward buttons
 * - Infinite autoplay decoration
 *
 * @important
 * This is a hint animation only. It should play once (or a limited number of
 * times) and then remain idle. Never autoplay forever.
 *
 * @example
 * ```tsx
 * // Carousel swipe hint — plays once on first view
 * <SliderArrowAnimation size={48} triggerOnView playOnce ariaLabel="Swipe to see more" />
 *
 * // With explicit click restart
 * const ref = useRef<AnimationControls>(null);
 * <SliderArrowAnimation controlRef={ref} size={32} autoplay={false} />
 * <button onClick={() => ref.current?.restart()}>Hint again</button>
 * ```
 */
import React from "react";
import { BaseLottie } from "../BaseLottie";
import type { AnimationProps } from "../types";
import animationData from "@/assets/lottie/slider-arrow.json";

export const SliderArrowAnimation = React.memo(function SliderArrowAnimation(props: AnimationProps) {
  return (
    <BaseLottie
      {...props}
      animationData={animationData}
      defaultLoop={false}
      defaultAutoplay={false}
      ariaLabel={props.ariaLabel ?? "Swipe or scroll horizontally"}
    />
  );
});

SliderArrowAnimation.displayName = "SliderArrowAnimation";
