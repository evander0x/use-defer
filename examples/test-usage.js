// 简单的使用示例
const { useCoreDefer } = require("../dist/index");

console.log("=== useCoreDefer 测试 ===");

// 测试框架无关的 useCoreDefer
const defer = useCoreDefer(100);
console.log("useCoreDefer 类型:", typeof defer);

// 测试基本功能
console.log("初始状态:", defer(0));
console.log("第 10 帧状态:", defer(10));
console.log("第 50 帧状态:", defer(50));
