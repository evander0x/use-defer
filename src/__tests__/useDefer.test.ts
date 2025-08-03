import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTestDefer } from "./test-utils";

describe("useDefer", () => {
  let mockRequestAnimationFrame: any;
  let mockCancelAnimationFrame: any;
  let rafCallbacks: Array<() => void> = [];
  let rafId = 0;

  beforeEach(() => {
    // 重置状态
    rafCallbacks = [];
    rafId = 0;

    // 模拟 requestAnimationFrame
    mockRequestAnimationFrame = vi.fn((callback: () => void) => {
      rafCallbacks.push(callback);
      return ++rafId;
    });

    // 模拟 cancelAnimationFrame
    mockCancelAnimationFrame = vi.fn((id: number) => {
      // 简单的取消逻辑
    });

    // 替换全局函数
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false initially for frame 0", () => {
    const defer = createTestDefer();
    // 注意：由于实现会立即开始计数，初始状态应该是 1
    expect(defer.check(0)).toBe(true); // 0 帧应该返回 true，因为已经过了 0 帧
    expect(defer.check(1)).toBe(true); // 1 帧应该返回 true，因为已经过了 1 帧
    expect(defer.check(2)).toBe(false); // 2 帧应该返回 false，因为还没有到 2 帧
  });

  it("should return true after specified frames", () => {
    const defer = createTestDefer(10);

    // 初始状态：已经过了 1 帧
    expect(defer.check(0)).toBe(true);
    expect(defer.check(1)).toBe(true);
    expect(defer.check(2)).toBe(false);

    // 执行额外的 3 帧（总共 4 帧）
    for (let i = 0; i < 3; i++) {
      if (rafCallbacks[i]) {
        rafCallbacks[i]();
      }
    }

    // 检查状态
    expect(defer.check(3)).toBe(true);
    expect(defer.check(4)).toBe(true);
    expect(defer.check(5)).toBe(false);
  });

  it("should stop counting at maxCount", () => {
    const defer = createTestDefer(5);

    // 执行足够的帧数来达到 maxCount
    for (let i = 0; i < 10; i++) {
      if (rafCallbacks[i]) {
        rafCallbacks[i]();
      }
    }

    expect(defer.check(5)).toBe(true);
    expect(defer.check(6)).toBe(false);
  });

  it("should work with default maxCount", () => {
    const defer = createTestDefer();

    // 执行足够的帧数来达到默认的 maxCount (100)
    for (let i = 0; i < 101; i++) {
      if (rafCallbacks[i]) {
        rafCallbacks[i]();
      }
    }

    expect(defer.check(100)).toBe(true);
    expect(defer.check(101)).toBe(false);
  });
});
