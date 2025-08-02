import { getAnimationFrame, getCancelAnimationFrame } from "../core/utils";
import React, { useState, useEffect } from "react";

/**
 * React 特定的 useDefer 实现
 *
 * @param maxCount - Maximum number of animation frames to count (default: 100)
 * @returns A function that returns true if the current frame count is greater than or equal to the provided number
 */
export function useDefer(maxCount = 100) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const requestAnimationFrame = getAnimationFrame();
    const cancelAnimationFrame = getCancelAnimationFrame();

    function updateFrame() {
      setCount((prevCount: number) => {
        const newCount = prevCount + 1;
        if (newCount < maxCount) {
          rafId = requestAnimationFrame(updateFrame);
        }
        return newCount;
      });
    }

    updateFrame();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [maxCount]);

  return function (n: number): boolean {
    return count >= n;
  };
}
