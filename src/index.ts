import { ref, onUnmounted } from "vue";

// 兼容性处理：当 requestAnimationFrame 不可用时使用 setTimeout
const getAnimationFrame = () => {
  if (typeof requestAnimationFrame !== "undefined") {
    return requestAnimationFrame;
  }

  // 降级到 setTimeout，模拟 60fps
  return (callback: FrameRequestCallback) => {
    return setTimeout(callback, 1000 / 60) as unknown as number;
  };
};

const getCancelAnimationFrame = () => {
  if (typeof cancelAnimationFrame !== "undefined") {
    return cancelAnimationFrame;
  }

  // 降级到 clearTimeout
  return (id: number) => {
    clearTimeout(id);
  };
};

/**
 * A Vue 3 composable that defers operations using requestAnimationFrame
 *
 * Features:
 * - Uses native requestAnimationFrame in modern browsers
 * - Falls back to setTimeout (60fps) in older browsers or Node.js
 * - Automatically cleans up on component unmount
 *
 * @param maxCount - Maximum number of animation frames to count (default: 100)
 * @returns A function that returns true if the current frame count is greater than or equal to the provided number
 */
export function useDefer(maxCount = 100) {
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

export default useDefer;
