# use-defer

一个智能的框架无关 hook，自动检测 React 或 Vue 环境，用于使用 `requestAnimationFrame` 延迟执行操作。

## 安装

```bash
npm install @evander0x/use-defer
```

## 使用方法

### 自动框架检测（推荐）

包会自动检测你的项目环境并选择相应的实现：

```javascript
import { useDefer } from "@evander0x/use-defer";

const defer = useDefer(100); // 最多计数到 100 帧

// 检查是否应该显示内容
const shouldShow = defer(30);
const shouldShowLater = defer(60);
```

### Vue 3 用法

```vue
<template>
  <div>
    <p v-if="shouldShow">这个内容在第 30 帧后显示</p>
    <p v-if="shouldShowLater">这个内容在第 60 帧后显示</p>
  </div>
</template>

<script setup lang="ts">
import { useDefer } from "@evander0x/use-defer";

const defer = useDefer(100); // 自动检测到 Vue 环境

// 检查是否应该显示内容
const shouldShow = defer(30);
const shouldShowLater = defer(60);
</script>
```

### React 用法

```jsx
import React from "react";
import { useDefer } from "@evander0x/use-defer";

function MyComponent() {
  const defer = useDefer(100); // 自动检测到 React 环境

  return (
    <div>
      {defer(30) && <p>这个内容在第 30 帧后显示</p>}
      {defer(60) && <p>这个内容在第 60 帧后显示</p>}
    </div>
  );
}
```

### 手动选择框架实现

如果你想要明确指定使用哪个框架的实现：

```javascript
import { useReactDefer, useVueDefer, useCoreDefer } from "@evander0x/use-defer";

// React 特定实现
const reactDefer = useReactDefer(100);

// Vue 特定实现
const vueDefer = useVueDefer(100);

// 框架无关实现
const coreDefer = useCoreDefer(100);
```

### 检测当前框架

```javascript
import { getDetectedFramework } from "@evander0x/use-defer";

const framework = getDetectedFramework();
console.log(framework); // 'react', 'vue', 或 'unknown'
```

## API

### useDefer(maxCount?: number)

自动检测框架并创建相应的延迟函数。

#### 参数

- `maxCount` (可选): 最大帧数，默认为 100

#### 返回值

返回一个函数，该函数接受一个数字参数 `n`，当当前帧数大于等于 `n` 时返回 `true`。

### useReactDefer(maxCount?: number)

React 特定的延迟 hook。

### useVueDefer(maxCount?: number)

Vue 3 特定的延迟 hook。

### useCoreDefer(maxCount?: number)

框架无关的延迟实现。

### getDetectedFramework()

返回检测到的框架类型：`'react'`、`'vue'` 或 `'unknown'`。

## 与 React 内置功能的区别

虽然 React 提供了 `useDeferredValue`、`startTransition` 等内置的延迟功能，但 `useDefer` 有其独特的优势：

### 精确的帧控制

- **useDefer**: 可以精确控制在第几帧显示内容
- **React 内置**: 基于优先级和调度器，无法精确控制帧数

### 框架无关性

- **useDefer**: 支持 React、Vue 3 和其他框架
- **React 内置**: 仅适用于 React

### 渐进式渲染

- **useDefer**: 适合分阶段渲染大量内容
- **React 内置**: 更适合状态更新的延迟

## 工作原理

`useDefer` 使用 `requestAnimationFrame` 来计数动画帧，具有以下特性：

### 框架检测逻辑

1. **React 检测**: 检查 `react` 模块是否可用，或检查全局 `React` 对象
2. **Vue 检测**: 检查 `vue` 模块是否可用，或检查全局 `Vue` 对象
3. **降级**: 如果无法检测到特定框架，使用框架无关的实现

### 兼容性处理

- **现代浏览器**: 使用原生的 `requestAnimationFrame`
- **旧版浏览器**: 自动降级到 `setTimeout` 模拟 60fps
- **Node.js 环境**: 同样使用 `setTimeout` 降级方案

这对于以下场景特别有用：

- 延迟加载非关键内容
- 分阶段渲染复杂组件
- 优化页面性能
- 实现渐进式加载

## 示例场景

### 1. 延迟显示内容

```vue
<template>
  <div>
    <div v-if="showImmediate">立即显示</div>
    <div v-if="showAfter10Frames">10帧后显示</div>
    <div v-if="showAfter30Frames">30帧后显示</div>
  </div>
</template>

<script setup>
import { useDefer } from "@evander0x/use-defer";

const defer = useDefer(); // 自动检测框架
const showImmediate = true;
const showAfter10Frames = defer(10);
const showAfter30Frames = defer(30);
</script>
```

### 2. 渐进式加载列表

```vue
<template>
  <div>
    <div v-for="(item, index) in visibleItems" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDefer } from "@evander0x/use-defer";

const items = ref([
  /* 大量数据 */
]);
const defer = useDefer(); // 自动检测框架

const visibleItems = computed(() => {
  const frame = defer(0)
    ? 0
    : defer(10)
    ? 10
    : defer(20)
    ? 20
    : items.value.length;
  return items.value.slice(0, frame);
});
</script>
```

## 兼容性

`useDefer` 具有良好的浏览器兼容性：

- **现代浏览器**: 使用原生的 `requestAnimationFrame`
- **旧版浏览器**: 自动降级到 `setTimeout` 模拟 60fps
- **Node.js 环境**: 同样使用 `setTimeout` 降级方案
- **框架支持**: 自动检测 React、Vue 3 和其他框架

## 注意事项

- 帧计数会在组件卸载时自动清理
- 默认最大帧数为 100，可以根据需要调整
- 在非浏览器环境中，使用 `setTimeout` 模拟动画帧，性能可能略有差异
- 框架检测在首次调用 `useDefer` 时进行，后续调用会复用检测结果
- 如果自动检测失败，会使用框架无关的实现

## 许可证

MIT
