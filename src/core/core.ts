import { getAnimationFrame, getCancelAnimationFrame } from "./utils";

// 框架无关的核心逻辑
export class DeferManager {
  private count = 0;
  private rafId: number | null = null;
  private maxCount: number;
  private isDestroyed = false;

  constructor(maxCount = 100) {
    this.maxCount = maxCount;
    this.start();
  }

  private start() {
    const requestAnimationFrame = getAnimationFrame();

    const updateFrame = () => {
      if (this.isDestroyed) return;

      this.count++;
      // 继续计数直到达到 maxCount，然后停止
      if (this.count < this.maxCount) {
        this.rafId = requestAnimationFrame(updateFrame);
      }
    };

    updateFrame();
  }

  public check(n: number): boolean {
    return this.count >= n;
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.rafId !== null) {
      const cancelAnimationFrame = getCancelAnimationFrame();
      cancelAnimationFrame(this.rafId);
    }
  }
}

/**
 * 框架无关的 useDefer 实现
 *
 * @param maxCount - Maximum number of animation frames to count (default: 100)
 * @returns A function that returns true if the current frame count is greater than or equal to the provided number
 */
export function useDefer(maxCount = 100) {
  const manager = new DeferManager(maxCount);

  return function (n: number): boolean {
    return manager.check(n);
  };
}
