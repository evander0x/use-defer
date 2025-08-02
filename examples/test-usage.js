// 简单的使用示例
const { useDefer, useCoreDefer } = require("../dist/index");

console.log("=== useDefer 测试 ===");

// 测试自动检测的 useDefer
const defer = useDefer(100);
console.log("useDefer 类型:", typeof defer);
console.log("defer(10) 结果:", defer(10));

// 测试核心实现
const coreDefer = useCoreDefer(100);
console.log("useCoreDefer 类型:", typeof coreDefer);
console.log("coreDefer(10) 结果:", coreDefer(10));

console.log("=== 测试完成 ===");
