import { getAnimationFrame, getCancelAnimationFrame } from "../utils";

/**
 * 测试用的 defer 实现，不依赖 React hooks
 */
export function createTestDefer(maxCount = 100) {
  let count = 0;
  let rafId: number | null = null;
  let isDestroyed = false;

  const requestAnimationFrame = getAnimationFrame();
  const cancelAnimationFrame = getCancelAnimationFrame();

  function updateFrame() {
    if (isDestroyed) return;

    count++;
    if (count < maxCount) {
      rafId = requestAnimationFrame(updateFrame);
    }
  }

  updateFrame();

  function check(n: number): boolean {
    return count >= n;
  }

  function destroy() {
    isDestroyed = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  }

  return { check, destroy, count: () => count };
}
