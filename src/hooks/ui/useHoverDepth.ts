/**
 * useHoverDepth
 * A comprehensive interaction sensor for the Product Card.
 * Tracks global cursor position to calculate awareness (proximity),
 * direct hover state, and normalized depth coordinates.
 *
 * States:
 * - isHovering: Cursor is directly over the element.
 * - isAware: Cursor is within a magnetic radius of the element.
 * - isCentered: Element is near the vertical center of the viewport (attention hierarchy).
 *
 * Returns normalized { x, y } coordinates in the range [-1, 1]
 * for driving material responses, depth, and lighting.
 */
import { useState, useEffect, useRef, type RefObject } from "react";

interface InteractionResult {
  x: number; // -1 to 1 (left to right from center)
  y: number; // -1 to 1 (top to bottom from center)
  proximity: number; // 0 (far) to 1 (center)
  isHovering: boolean;
  isAware: boolean;
  isCentered: boolean;
}

const AWARENESS_RADIUS = 300; // pixels

export function useHoverDepth(ref: RefObject<Element | null>): InteractionResult {
  const [state, setState] = useState<InteractionResult>({
    x: 0,
    y: 0,
    proximity: 0,
    isHovering: false,
    isAware: false,
    isCentered: false,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on touch-primary devices — they handle states via IntersectionObserver instead
    if (window.matchMedia("(hover: none)").matches) return;

    // Track scroll to calculate if centered
    const checkCentered = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - elementCenter);
      
      // If within 300px of center, consider it 'centered' (attention hierarchy)
      const isCentered = distance < 300;
      
      setState(prev => prev.isCentered !== isCentered ? { ...prev, isCentered } : prev);
    };

    const onMove = (e: MouseEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        
        // Element center
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        // Distance from cursor to element center
        const distX = e.clientX - elCenterX;
        const distY = e.clientY - elCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Normalize coordinates relative to element size (-1 to 1)
        // Clamp to [-1, 1] for the inner hover area
        const rawX = (e.clientX - rect.left) / rect.width;
        const rawY = (e.clientY - rect.top) / rect.height;
        
        const x = Math.max(-1, Math.min(1, (rawX * 2) - 1));
        const y = Math.max(-1, Math.min(1, (rawY * 2) - 1));

        // Proximity (1 = dead center, 0 = edge of awareness radius)
        const proximity = Math.max(0, 1 - (distance / AWARENESS_RADIUS));

        const isHovering = rawX >= 0 && rawX <= 1 && rawY >= 0 && rawY <= 1;
        const isAware = proximity > 0 && !isHovering;

        setState(prev => ({
          ...prev,
          x,
          y,
          proximity,
          isHovering,
          isAware
        }));
      });
    };

    const onLeave = () => {
      // We don't listen to mouseleave on the element anymore, we listen globally
      // so we can track awareness radius.
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", checkCentered, { passive: true });
    
    // Initial check
    checkCentered();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", checkCentered);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return state;
}
