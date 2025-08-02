// 自动框架检测示例
import { useDefer, getDetectedFramework } from "../src/index";

// 检测当前框架
const framework = getDetectedFramework();
console.log(`检测到的框架: ${framework}`);

// 使用自动检测的 useDefer
const defer = useDefer(100);

// 模拟使用
function simulateUsage() {
  console.log(`第 0 帧: ${defer(0)}`);
  console.log(`第 10 帧: ${defer(10)}`);
  console.log(`第 30 帧: ${defer(30)}`);
  console.log(`第 60 帧: ${defer(60)}`);
}

// 在浏览器环境中运行
if (typeof window !== "undefined") {
  // 模拟几帧后
  setTimeout(() => {
    simulateUsage();
  }, 100);
} else {
  // Node.js 环境
  simulateUsage();
}

export { defer, framework };
