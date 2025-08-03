/**
 * 获取 requestAnimationFrame 函数
 * 支持浏览器环境和 Node.js 环境
 */
export function getAnimationFrame(): (
  callback: FrameRequestCallback
) => number {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    return window.requestAnimationFrame;
  }

  // Node.js 环境的 fallback
  return (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 16) as any;
  };
}

/**
 * 获取 cancelAnimationFrame 函数
 * 支持浏览器环境和 Node.js 环境
 */
export function getCancelAnimationFrame(): (handle: number) => void {
  if (typeof window !== "undefined" && window.cancelAnimationFrame) {
    return window.cancelAnimationFrame;
  }

  // Node.js 环境的 fallback
  return (handle: number) => {
    clearTimeout(handle);
  };
}
