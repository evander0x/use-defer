// 导出框架特定的实现，供手动选择使用
export { useDefer as useReactDefer } from "./frameworks/react";
export { useDefer as useVueDefer } from "./frameworks/vue";
export { useDefer as useCoreDefer } from "./core/core";

// 为了向后兼容，默认导出核心实现
export { useDefer as default } from "./core/core";
