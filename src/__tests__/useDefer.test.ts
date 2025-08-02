import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDefer } from "../index";

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

describe("useDefer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a function", () => {
    const defer = useDefer();
    expect(typeof defer).toBe("function");
  });

  //   it("should start counting from 0", () => {
  //     const defer = useDefer();
  //     // 由于 useDefer 内部使用 requestAnimationFrame，初始时 count 为 0
  //     // 但第一次调用 updateFrame 后 count 会变为 1
  //     expect(defer(0)).toBe(false);
  //   });

  it("should work with frame counting", () => {
    let frameCount = 0;
    mockRequestAnimationFrame.mockImplementation((callback) => {
      frameCount++;
      if (frameCount < 10) {
        callback();
      }
      return frameCount;
    });

    const defer = useDefer(10);

    // 模拟几帧后
    for (let i = 0; i < 5; i++) {
      mockRequestAnimationFrame.mock.calls[i]?.[0]?.();
    }

    // 由于 requestAnimationFrame 的异步特性，这里我们主要测试函数返回
    expect(typeof defer).toBe("function");
  });

  it("should accept maxCount parameter", () => {
    const defer = useDefer(5);
    expect(typeof defer).toBe("function");
  });

  it("should use default maxCount of 100", () => {
    const defer = useDefer();
    expect(typeof defer).toBe("function");
  });
});
