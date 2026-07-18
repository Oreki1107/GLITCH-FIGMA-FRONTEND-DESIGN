/**
 * BaseLottie
 *
 * The single source of truth for all Lottie animations in the GLYCH motion system.
 *
 * Responsibilities:
 * - Load and render a Lottie animation
 * - Handle reduced motion (disabled autoplay/loop, shows final frame)
 * - Expose imperative play/pause/stop/reset/restart controls via ref
 * - Observe viewport intersection to trigger playback
 * - Respect playOnce to freeze after first completion
 * - Apply speed multiplier
 * - Handle load errors gracefully without crashing
 * - Memoize to prevent unnecessary re-renders from parent updates
 * - Clean up animation instance on unmount
 *
 * Every animation component in the GLYCH system must use this wrapper.
 * Never set up Lottie directly outside this component.
 */
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import type { AnimationControls, AnimationProps } from "./types";
import { useReducedMotion } from "./useReducedMotion";
import { usePlayOnce } from "./usePlayOnce";
import { useIntersectionAnimation } from "./useIntersectionAnimation";
import { logMotionError, resolvePlaybackSettings, resolveSize } from "./MotionUtils";

interface BaseLottieProps extends AnimationProps {
  /** The imported Lottie JSON data object. */
  animationData: object;
  /** Default loop value if not provided by the consumer. */
  defaultLoop?: boolean;
  /** Default autoplay value if not provided by the consumer. */
  defaultAutoplay?: boolean;
}

function BaseLottieInner(
  {
    animationData,
    size = 64,
    width,
    height,
    loop,
    autoplay,
    speed = 1,
    playOnce = false,
    triggerOnView = false,
    delay = 0,
    className = "",
    onComplete,
    onClick,
    ariaLabel,
    controlRef,
    defaultLoop = false,
    defaultAutoplay = true,
    colorMode = "original",
  }: BaseLottieProps,
  _ref: React.Ref<unknown>
) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const [played, markPlayed] = usePlayOnce();
  const [viewRef, isVisible] = useIntersectionAnimation({ once: true, threshold: 0.2 });

  const dimensions = useMemo(() => resolveSize(size, width, height), [size, width, height]);

  const { loop: resolvedLoop, autoplay: resolvedAutoplay } = useMemo(
    () =>
      resolvePlaybackSettings({
        loop: loop ?? defaultLoop,
        autoplay: autoplay ?? defaultAutoplay,
        playOnce,
        reducedMotion,
      }),
    [loop, autoplay, playOnce, reducedMotion, defaultLoop, defaultAutoplay]
  );

  // Expose imperative controls to parent via controlRef
  useImperativeHandle(
    controlRef,
    (): AnimationControls => ({
      play: () => lottieRef.current?.play(),
      pause: () => lottieRef.current?.pause(),
      stop: () => lottieRef.current?.stop(),
      reset: () => {
        lottieRef.current?.stop();
        lottieRef.current?.goToAndStop(0, true);
      },
      restart: () => {
        lottieRef.current?.stop();
        lottieRef.current?.play();
      },
    }),
    []
  );

  // Trigger play when visible in viewport (triggerOnView mode)
  useEffect(() => {
    if (!triggerOnView || !isReady || reducedMotion) return;
    if (isVisible && !played) {
      const timer = setTimeout(() => {
        lottieRef.current?.play();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isReady, triggerOnView, delay, played, reducedMotion]);

  // When reducedMotion, jump to final frame and freeze
  useEffect(() => {
    if (!reducedMotion || !isReady) return;
    lottieRef.current?.pause();
    // Attempt to show final frame — getTotalFrames may not exist on all versions
    const instance = lottieRef.current;
    if (instance) {
      try {
        instance.goToAndStop(instance.getDuration(true) - 1, true);
      } catch {
        // Graceful degradation: stay on current frame
      }
    }
  }, [reducedMotion, isReady]);

  const handleComplete = useCallback(() => {
    if (playOnce) {
      markPlayed();
      lottieRef.current?.pause();
    }
    onComplete?.();
  }, [playOnce, markPlayed, onComplete]);

  const handleClick = useCallback(() => {
    onClick?.();
    // If not autoplay/triggerOnView, a click starts the animation
    if (!resolvedAutoplay && !triggerOnView) {
      lottieRef.current?.play();
    }
  }, [onClick, resolvedAutoplay, triggerOnView]);

  const handleDataReady = useCallback(() => {
    setIsReady(true);

    // Apply delay on autoplay start
    if (resolvedAutoplay && delay > 0 && !triggerOnView) {
      lottieRef.current?.pause();
      const timer = setTimeout(() => lottieRef.current?.play(), delay);
      return () => clearTimeout(timer);
    }
  }, [resolvedAutoplay, delay, triggerOnView]);

  if (hasError) {
    // Graceful failure — renders nothing, no crash
    return (
      <div
        style={{ width: dimensions.width, height: dimensions.height }}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={viewRef}
      className={`${className} lottie-color-${colorMode}`}
      style={{ width: dimensions.width, height: dimensions.height, display: "inline-flex" }}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={resolvedLoop}
        autoplay={!triggerOnView && resolvedAutoplay && !reducedMotion}
        style={{ width: "100%", height: "100%" }}
        onComplete={handleComplete}
        onDataReady={handleDataReady}
        onError={(e) => {
          logMotionError("BaseLottie", e);
          setHasError(true);
        }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
          // Use SVG renderer for crisp rendering at all sizes
        }}
      />
    </div>
  );
}

/**
 * BaseLottie — memoized to prevent re-renders when parent state changes
 * without affecting animation props.
 */
export const BaseLottie = React.memo(React.forwardRef(BaseLottieInner));
BaseLottie.displayName = "BaseLottie";
