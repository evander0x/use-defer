import { useDefer as coreUseDefer } from "./core/core";

// 框架检测函数
function detectFramework(): "react" | "vue" | "unknown" {
  const availableFrameworks: ("react" | "vue")[] = [];

  // 检测全局变量
  if (typeof window !== "undefined") {
    if (
      (window as any).React ||
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      availableFrameworks.push("react");
    }
    if ((window as any).Vue || (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      availableFrameworks.push("vue");
    }
  }

  // 检测模块可用性（在 Node.js 环境中）
  try {
    if (typeof require !== "undefined") {
      require("react");
      if (!availableFrameworks.includes("react")) {
        availableFrameworks.push("react");
      }
    }
  } catch (e) {
    // React 不可用
  }

  try {
    if (typeof require !== "undefined") {
      require("vue");
      if (!availableFrameworks.includes("vue")) {
        availableFrameworks.push("vue");
      }
    }
  } catch (e) {
    // Vue 不可用
  }

  // 智能选择策略：优先选择 React，然后是 Vue
  if (availableFrameworks.includes("react")) {
    return "react";
  }
  if (availableFrameworks.includes("vue")) {
    return "vue";
  }

  return "unknown";
}

// 缓存检测结果
let frameworkDetected: "react" | "vue" | "unknown" = "unknown";

/**
 * 重置框架检测缓存（主要用于测试）
 */
export function resetFrameworkDetection() {
  frameworkDetected = "unknown";
}

/**
 * 自动检测框架的 useDefer hook
 *
 * 特性：
 * - 自动检测 React 或 Vue 环境
 * - 使用原生 requestAnimationFrame 在现代浏览器中
 * - 在旧版浏览器或 Node.js 中降级到 setTimeout (60fps)
 * - 组件卸载时自动清理
 * - 框架无关 - 支持 React、Vue 和其他框架
 *
 * @param maxCount - Maximum number of animation frames to count (default: 100)
 * @returns A function that returns true if the current frame count is greater than or equal to the provided number
 */
export function useDefer(maxCount = 100) {
  // 首次调用时检测框架
  if (frameworkDetected === "unknown") {
    frameworkDetected = detectFramework();
  }

  // 根据检测结果选择实现
  switch (frameworkDetected) {
    case "react":
      try {
        const { useDefer: reactUseDefer } = require("./frameworks/react");
        return reactUseDefer(maxCount);
      } catch (e) {
        // 如果 React 实现不可用，使用核心实现
        return coreUseDefer(maxCount);
      }
    case "vue":
      try {
        const { useDefer: vueUseDefer } = require("./frameworks/vue");
        return vueUseDefer(maxCount);
      } catch (e) {
        // 如果 Vue 实现不可用，使用核心实现
        return coreUseDefer(maxCount);
      }
    default:
      // 使用框架无关的实现
      return coreUseDefer(maxCount);
  }
}

// 导出框架特定的实现，供手动选择使用
export { useDefer as useReactDefer } from "./frameworks/react";
export { useDefer as useVueDefer } from "./frameworks/vue";
export { useDefer as useCoreDefer } from "./core/core";

// 导出框架检测结果
export function getDetectedFramework() {
  if (frameworkDetected === "unknown") {
    frameworkDetected = detectFramework();
  }
  return frameworkDetected;
}

export default useDefer;
