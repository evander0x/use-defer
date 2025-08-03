import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAnimationFrame, getCancelAnimationFrame } from "../utils";

describe("Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAnimationFrame", () => {
    it("should return requestAnimationFrame when available", () => {
      const raf = getAnimationFrame();
      expect(typeof raf).toBe("function");
    });

    it("should return a function that calls setTimeout when requestAnimationFrame is not available", () => {
      // Mock requestAnimationFrame as undefined
      const originalRAF = global.requestAnimationFrame;
      delete (global as any).requestAnimationFrame;

      const raf = getAnimationFrame();
      expect(typeof raf).toBe("function");

      // Restore
      global.requestAnimationFrame = originalRAF;
    });
  });

  describe("getCancelAnimationFrame", () => {
    it("should return cancelAnimationFrame when available", () => {
      const cancelRAF = getCancelAnimationFrame();
      expect(typeof cancelRAF).toBe("function");
    });

    it("should return a function that calls clearTimeout when cancelAnimationFrame is not available", () => {
      // Mock cancelAnimationFrame as undefined
      const originalCancelRAF = global.cancelAnimationFrame;
      delete (global as any).cancelAnimationFrame;

      const cancelRAF = getCancelAnimationFrame();
      expect(typeof cancelRAF).toBe("function");

      // Restore
      global.cancelAnimationFrame = originalCancelRAF;
    });
  });
});
