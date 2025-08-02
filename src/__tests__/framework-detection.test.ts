import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDetectedFramework, resetFrameworkDetection } from "../index";

describe("Framework Detection", () => {
  beforeEach(() => {
    // 清理全局变量
    if (typeof window !== "undefined") {
      delete (window as any).React;
      delete (window as any).Vue;
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      delete (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__;
    }
    // 重置框架检测缓存
    resetFrameworkDetection();
  });

  it("should return a valid framework type", () => {
    const framework = getDetectedFramework();
    expect(typeof framework).toBe("string");
    expect(["react", "vue", "unknown"]).toContain(framework);
  });

  it("should detect React from global window object", () => {
    if (typeof window !== "undefined") {
      (window as any).React = {};

      // 重新获取检测结果
      const framework = getDetectedFramework();
      expect(framework).toBe("react");
    }
  });

  it("should detect Vue from global window object", () => {
    if (typeof window !== "undefined") {
      (window as any).Vue = {};

      // 重新获取检测结果
      const framework = getDetectedFramework();
      expect(framework).toBe("vue");
    }
  });

  it("should detect React devtools hook", () => {
    if (typeof window !== "undefined") {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};

      // 重新获取检测结果
      const framework = getDetectedFramework();
      expect(framework).toBe("react");
    }
  });

  it("should detect Vue devtools hook", () => {
    if (typeof window !== "undefined") {
      (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ = {};

      // 重新获取检测结果
      const framework = getDetectedFramework();
      expect(framework).toBe("vue");
    }
  });

  it("should prioritize React when both frameworks are available", () => {
    if (typeof window !== "undefined") {
      (window as any).React = {};
      (window as any).Vue = {};

      // 重新获取检测结果
      const framework = getDetectedFramework();
      expect(framework).toBe("react");
    }
  });

  it("should work with useDefer function", () => {
    const { useDefer } = require("../../dist/index.js");
    const defer = useDefer(100);
    expect(typeof defer).toBe("function");
  });
});
