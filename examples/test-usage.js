// 测试 useDefer 的行为
import { useCoreDefer } from "../dist/index.js";

// 模拟 requestAnimationFrame
let frameCount = 0;
const originalRAF = global.requestAnimationFrame;
global.requestAnimationFrame = (callback) => {
  frameCount++;
  setTimeout(callback, 16); // 模拟 60fps
  return frameCount;
};

// 测试用例
console.log("开始测试 useDefer...");

const defer = useCoreDefer(5); // 设置最大帧数为 5

// 初始状态
console.log("初始状态:");
console.log("defer(0):", defer(0)); // 应该返回 true
console.log("defer(1):", defer(1)); // 应该返回 true
console.log("defer(2):", defer(2)); // 应该返回 false
console.log("defer(3):", defer(3)); // 应该返回 false
console.log("defer(4):", defer(4)); // 应该返回 false
console.log("defer(5):", defer(5)); // 应该返回 false

// 等待几帧后再次检查
setTimeout(() => {
  console.log("\n等待几帧后:");
  console.log("defer(0):", defer(0)); // 应该返回 true
  console.log("defer(1):", defer(1)); // 应该返回 true
  console.log("defer(2):", defer(2)); // 应该返回 true
  console.log("defer(3):", defer(3)); // 应该返回 true
  console.log("defer(4):", defer(4)); // 应该返回 true
  console.log("defer(5):", defer(5)); // 应该返回 true
  console.log("defer(6):", defer(6)); // 应该返回 false
}, 100);

// 恢复原始的 requestAnimationFrame
setTimeout(() => {
  global.requestAnimationFrame = originalRAF;
}, 200);
