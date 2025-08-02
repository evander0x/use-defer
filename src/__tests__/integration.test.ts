import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDefer, useCoreDefer, getDetectedFramework } from "../index";

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should work with auto-detected useDefer", () => {
    const defer = useDefer(100);
    expect(typeof defer).toBe("function");

    // 测试函数调用
    const result = defer(10);
    expect(typeof result).toBe("boolean");
  });

  it("should work with core useDefer", () => {
    const defer = useCoreDefer(100);
    expect(typeof defer).toBe("function");

    // 测试函数调用
    const result = defer(10);
    expect(typeof result).toBe("boolean");
  });

  it("should handle different maxCount values", () => {
    const defer1 = useDefer(50);
    const defer2 = useDefer(200);

    expect(typeof defer1).toBe("function");
    expect(typeof defer2).toBe("function");
  });

  it("should detect framework correctly", () => {
    const framework = getDetectedFramework();
    expect(typeof framework).toBe("string");
    expect(["react", "vue", "unknown"]).toContain(framework);
  });
});
