import { useLenisContext } from "../context";

/**
 * useLenisInstance
 * Returns the active Lenis scroll instance and ready state.
 *
 * Use this hook when you need programmatic scroll control:
 * - lenis.scrollTo(target, options) — animated scroll to position or element
 * - lenis.stop() / lenis.start() — pause/resume smooth scroll
 * - lenis.on("scroll", handler) — subscribe to scroll events
 *
 * @example
 * const { lenis, ready } = useLenisInstance();
 * const handleClick = () => lenis?.scrollTo("#section", { duration: 1.2 });
 */
export function useLenisInstance() {
  const { lenis, ready } = useLenisContext();
  return { lenis, ready };
}
