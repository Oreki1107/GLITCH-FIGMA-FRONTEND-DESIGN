/**
 * usePlayOnce
 *
 * Returns a boolean that flips to `true` once and never again.
 * Used to prevent animations from replaying after their first completion.
 */
import { useCallback, useState } from "react";

export function usePlayOnce(): [boolean, () => void] {
  const [played, setPlayed] = useState(false);

  const markPlayed = useCallback(() => {
    setPlayed(true);
  }, []);

  return [played, markPlayed];
}
