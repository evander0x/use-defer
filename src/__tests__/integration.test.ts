import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCoreDefer } from "../index";

describe("Integration Tests", () => {
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

  it("should work with core useDefer", () => {
    const defer = useCoreDefer(100);

    // 测试基本功能
    expect(typeof defer).toBe("function");

    // 初始状态：已经过了 1 帧
    expect(defer(0)).toBe(true);
    expect(defer(1)).toBe(true);
    expect(defer(2)).toBe(false);

    // 执行几帧后测试
    if (rafCallbacks[0]) rafCallbacks[0]();
    if (rafCallbacks[1]) rafCallbacks[1]();

    expect(defer(2)).toBe(true);
    expect(defer(3)).toBe(true);
    expect(defer(4)).toBe(false);
  });

  it("should work with multiple instances", () => {
    const defer1 = useCoreDefer(50);
    const defer2 = useCoreDefer(200);

    // 测试多个实例可以独立工作
    expect(typeof defer1).toBe("function");
    expect(typeof defer2).toBe("function");

    // 初始状态
    expect(defer1(1)).toBe(true);
    expect(defer2(1)).toBe(true);

    // 执行几帧后测试
    if (rafCallbacks[0]) rafCallbacks[0]();
    if (rafCallbacks[1]) rafCallbacks[1]();

    expect(defer1(2)).toBe(true);
    expect(defer2(2)).toBe(true);
  });
});
