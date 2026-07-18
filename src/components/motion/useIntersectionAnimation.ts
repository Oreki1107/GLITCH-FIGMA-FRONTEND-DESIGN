/**
 * useIntersectionAnimation
 *
 * Watches an element's viewport visibility using IntersectionObserver.
 * Returns `isVisible` which can be used to trigger animation playback.
 *
 * Automatically disconnects the observer after first intersection if
 * `once` is true — suitable for `playOnce` animations below the fold.
 */
import { useEffect, useRef, useState } from "react";

interface UseIntersectionAnimationOptions {
  /** Disconnect after the first intersection. Default: true */
  once?: boolean;
  /** Intersection threshold (0–1). Default: 0.3 */
  threshold?: number;
  /** Root margin for the IntersectionObserver. Default: "0px" */
  rootMargin?: string;
}

export function useIntersectionAnimation(
  options: UseIntersectionAnimationOptions = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const { once = true, threshold = 0.3, rootMargin = "0px" } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, isVisible];
}
