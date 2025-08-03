# use-defer

一个框架无关的 hook，支持 React 和 Vue 环境，用于使用 `requestAnimationFrame` 延迟执行操作，特别适合优化大量数据渲染的性能。

## 功能应用场景

### 1. 仪表盘数据渲染优化

当仪表盘包含大量图表、表格或数据卡片时，一次性渲染所有内容会导致页面卡顿。使用 `useDefer` 可以分片渲染，提升用户体验：

<details>
<summary>Vue 3 仪表盘示例</summary>

```vue
<template>
  <div class="dashboard">
    <!-- 关键指标立即显示 -->
    <div class="key-metrics" v-if="showKeyMetrics">
      <MetricCard
        v-for="metric in keyMetrics"
        :key="metric.id"
        :data="metric"
      />
    </div>

    <!-- 次要图表延迟显示 -->
    <div class="secondary-charts" v-if="showSecondaryCharts">
      <ChartComponent
        v-for="chart in secondaryCharts"
        :key="chart.id"
        :data="chart"
      />
    </div>

    <!-- 详细数据表格最后显示 -->
    <div class="data-table" v-if="showDataTable">
      <DataTable :data="detailedData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer();

// 分阶段显示不同优先级的内容
const showKeyMetrics = true; // 立即显示关键指标
const showSecondaryCharts = defer(15); // 15帧后显示次要图表
const showDataTable = defer(30); // 30帧后显示详细数据表格
</script>
```

</details>

### 2. 列表分片渲染

对于长列表或大量数据，可以分批次渲染：

<details>
<summary>React 列表分片示例</summary>

```jsx
import React from "react";
import { useReactDefer } from "@evander0x/use-defer";

function DataList({ items }) {
  const defer = useReactDefer();

  // 根据当前帧数决定显示多少项
  const visibleCount = defer(0)
    ? 0
    : defer(10)
    ? 10
    : defer(20)
    ? 20
    : defer(30)
    ? 30
    : items.length;

  return (
    <div>
      {items.slice(0, visibleCount).map((item) => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
```

</details>

### 3. 复杂组件渐进式加载

<details>
<summary>Vue 3 复杂组件示例</summary>

```vue
<template>
  <div class="complex-component">
    <!-- 骨架屏立即显示 -->
    <SkeletonLoader v-if="!showContent" />

    <!-- 主要内容分阶段显示 -->
    <div v-if="showContent" class="content">
      <Header v-if="showHeader" />
      <MainContent v-if="showMainContent" />
      <Sidebar v-if="showSidebar" />
      <Footer v-if="showFooter" />
    </div>
  </div>
</template>

<script setup>
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer();

const showContent = defer(5);
const showHeader = defer(10);
const showMainContent = defer(15);
const showSidebar = defer(20);
const showFooter = defer(25);
</script>
```

</details>

## 安装

```bash
npm install @evander0x/use-defer
```

## 使用方法

### 框架无关实现（推荐）

如果你想要一个不依赖特定框架的实现：

```javascript
import { useCoreDefer } from "@evander0x/use-defer";

const defer = useCoreDefer(100); // 最多计数到 100 帧

// 检查是否应该显示内容
const shouldShow = defer(30);
const shouldShowLater = defer(60);
```

### Vue 3 用法

<details>
<summary>Vue 3 基础用法</summary>

```vue
<template>
  <div>
    <p v-if="shouldShow">这个内容在第 30 帧后显示</p>
    <p v-if="shouldShowLater">这个内容在第 60 帧后显示</p>
  </div>
</template>

<script setup lang="ts">
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer(100); // Vue 特定实现

// 检查是否应该显示内容
const shouldShow = defer(30);
const shouldShowLater = defer(60);
</script>
```

</details>

### React 用法

<details>
<summary>React 基础用法</summary>

```jsx
import React from "react";
import { useReactDefer } from "@evander0x/use-defer";

function MyComponent() {
  const defer = useReactDefer(100); // React 特定实现

  return (
    <div>
      {defer(30) && <p>这个内容在第 30 帧后显示</p>}
      {defer(60) && <p>这个内容在第 60 帧后显示</p>}
    </div>
  );
}
```

</details>

### 默认导出

为了向后兼容，包也提供了默认导出，使用框架无关的实现：

```javascript
import useDefer from "@evander0x/use-defer";

const defer = useDefer(100);
```

## API

### useCoreDefer(maxCount?: number)

框架无关的延迟实现。

#### 参数

- `maxCount` (可选): 最大帧数，默认为 100

#### 返回值

返回一个函数，该函数接受一个数字参数 `n`，当当前帧数大于等于 `n` 时返回 `true`。

### useReactDefer(maxCount?: number)

React 特定的延迟 hook。需要安装 `react` 依赖。

### useVueDefer(maxCount?: number)

Vue 3 特定的延迟 hook。需要安装 `vue` 依赖。

### useDefer(maxCount?: number)

默认导出，使用框架无关的实现。为了向后兼容而提供。

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

### 实现选择

- **useCoreDefer**: 框架无关实现，不依赖任何特定框架
- **useReactDefer**: React 特定实现，利用 React 的生命周期管理
- **useVueDefer**: Vue 3 特定实现，利用 Vue 的响应式系统

### 兼容性处理

- **现代浏览器**: 使用原生的 `requestAnimationFrame`
- **旧版浏览器**: 自动降级到 `setTimeout` 模拟 60fps
- **Node.js 环境**: 同样使用 `setTimeout` 降级方案

这对于以下场景特别有用：

- 延迟加载非关键内容
- 分阶段渲染复杂组件
- 优化页面性能
- 实现渐进式加载

## 更多示例场景

### 1. 延迟显示内容

<details>
<summary>基础延迟显示示例</summary>

```vue
<template>
  <div>
    <div v-if="showImmediate">立即显示</div>
    <div v-if="showAfter10Frames">10帧后显示</div>
    <div v-if="showAfter30Frames">30帧后显示</div>
  </div>
</template>

<script setup>
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer(); // Vue 特定实现
const showImmediate = true;
const showAfter10Frames = defer(10);
const showAfter30Frames = defer(30);
</script>
```

</details>

### 2. 渐进式加载列表

<details>
<summary>渐进式列表加载示例</summary>

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
import { useVueDefer } from "@evander0x/use-defer";

const items = ref([
  /* 大量数据 */
]);
const defer = useVueDefer(); // Vue 特定实现

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

</details>

## 兼容性

`useDefer` 具有良好的浏览器兼容性：

- **现代浏览器**: 使用原生的 `requestAnimationFrame`
- **旧版浏览器**: 自动降级到 `setTimeout` 模拟 60fps
- **Node.js 环境**: 同样使用 `setTimeout` 降级方案
- **框架支持**: 支持 React、Vue 3 和其他框架

## 注意事项

- 帧计数会在组件卸载时自动清理
- 默认最大帧数为 100，可以根据需要调整
- 在非浏览器环境中，使用 `setTimeout` 模拟动画帧，性能可能略有差异
- **依赖管理**：使用 `useReactDefer` 需要安装 `react` 依赖，使用 `useVueDefer` 需要安装 `vue` 依赖
- 推荐使用 `useCoreDefer` 如果你不需要特定框架的功能，这样可以避免额外的依赖

## 许可证

MIT
