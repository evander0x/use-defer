import { getAnimationFrame, getCancelAnimationFrame } from "../core/utils";

/**
 * Vue 3 特定的 useDefer 实现
 *
 * @param maxCount - Maximum number of animation frames to count (default: 100)
 * @returns A function that returns true if the current frame count is greater than or equal to the provided number
 */
export function useDefer(maxCount = 100) {
  // 动态导入 Vue 3 APIs
  const Vue = require("vue");
  const { ref, onUnmounted } = Vue;

  const count = ref(0);
  let rafId: number | null = null;

  const requestAnimationFrame = getAnimationFrame();
  const cancelAnimationFrame = getCancelAnimationFrame();

  function updateFrame() {
    count.value++;
    if (count.value >= maxCount) {
      return;
    }
    rafId = requestAnimationFrame(updateFrame);
  }

  updateFrame();

  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  });

  return function (n: number): boolean {
    return count.value >= n;
  };
}
