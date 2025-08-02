// 自动框架检测示例
import { useCoreDefer } from "../src/index";

console.log("=== useCoreDefer 示例 ===");

// 使用框架无关的实现
const defer = useCoreDefer(100);

console.log("useCoreDefer 类型:", typeof defer);
console.log("初始状态:", defer(0));
console.log("第 10 帧状态:", defer(10));
console.log("第 50 帧状态:", defer(50));
