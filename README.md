# useDefer

一个 Vue 3 组合式 API hook，用于使用 `requestAnimationFrame` 延迟执行操作。

## 安装

```bash
npm install vue-use-defer
```

## 使用方法

```vue
<template>
  <div>
    <p>当前帧数: {{ frameCount }}</p>
    <p v-if="shouldShow">这个内容在第 30 帧后显示</p>
    <p v-if="shouldShowLater">这个内容在第 60 帧后显示</p>
  </div>
</template>

<script setup lang="ts">
import { useDefer } from "vue-use-defer";

const defer = useDefer(100); // 最多计数到 100 帧
const frameCount = ref(0);

// 创建一个响应式的帧计数器
const updateFrameCount = () => {
  frameCount.value++;
  if (frameCount.value < 100) {
    requestAnimationFrame(updateFrameCount);
  }
};
updateFrameCount();

// 检查是否应该显示内容
const shouldShow = defer(30);
const shouldShowLater = defer(60);
</script>
```

## API

### useDefer(maxCount?: number)

创建一个延迟函数。

#### 参数

- `maxCount` (可选): 最大帧数，默认为 100

#### 返回值

返回一个函数，该函数接受一个数字参数 `n`，当当前帧数大于等于 `n` 时返回 `true`。

## 工作原理

`useDefer` 使用 `requestAnimationFrame` 来计数动画帧。这对于以下场景特别有用：

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
import { useDefer } from "vue-use-defer";

const defer = useDefer();
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
import { useDefer } from "vue-use-defer";

const items = ref([
  /* 大量数据 */
]);
const defer = useDefer();

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

## 注意事项

- 这个 hook 依赖于 `requestAnimationFrame`，只在浏览器环境中工作
- 帧计数会在组件卸载时自动清理
- 默认最大帧数为 100，可以根据需要调整

## 许可证

MIT
