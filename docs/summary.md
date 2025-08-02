# use-defer 项目总结

## 项目概述

`use-defer` 是一个框架无关的 hook，支持 React 和 Vue 环境，用于使用 `requestAnimationFrame` 延迟执行操作。

## 主要特性

- ✅ 实现了 `useCoreDefer` 框架无关实现
- ✅ 实现了 `useReactDefer` React 特定实现
- ✅ 实现了 `useVueDefer` Vue 3 组合式 API
- ✅ 支持 TypeScript
- ✅ 完整的测试覆盖
- ✅ 支持现代浏览器和旧版浏览器降级
- ✅ 支持 Node.js 环境

## 技术栈

- **构建工具**: tsup
- **测试框架**: vitest
- **语言**: TypeScript
- **包管理器**: npm

## 项目结构

```
use-defer/
├── src/
│   ├── core/
│   │   ├── core.ts          # 核心实现
│   │   └── utils.ts         # 工具函数
│   ├── frameworks/
│   │   ├── react.ts         # React 实现
│   │   └── vue.ts           # Vue 实现
│   ├── __tests__/
│   │   ├── useDefer.test.ts # 核心功能测试
│   │   └── integration.test.ts # 集成测试
│   └── index.ts             # 主入口文件
├── examples/
│   ├── basic.jsx            # React 示例
│   ├── basic.vue            # Vue 示例
│   └── test-usage.js        # 使用示例
├── docs/
│   ├── summary.md           # 项目总结
│   ├── quick-reference.md   # 快速参考
│   └── publishing-guide.md  # 发布指南
├── scripts/
│   ├── build.sh             # 构建脚本
│   └── publish.sh           # 发布脚本
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## 核心实现

### 框架无关实现 (useCoreDefer)

```typescript
// src/core/core.ts
export function useDefer(maxCount = 100) {
  let count = 0;
  let rafId: number | null = null;

  const requestAnimationFrame = getAnimationFrame();
  const cancelAnimationFrame = getCancelAnimationFrame();

  function updateFrame() {
    count++;
    if (count >= maxCount) {
      return;
    }
    rafId = requestAnimationFrame(updateFrame);
  }

  updateFrame();

  // 清理函数
  const cleanup = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };

  return function (n: number): boolean {
    return count >= n;
  };
}
```

### React 特定实现

```typescript
// src/frameworks/react.ts
export function useDefer(maxCount = 100) {
  const React = require("react");
  const { useState, useEffect } = React;

  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const requestAnimationFrame = getAnimationFrame();
    const cancelAnimationFrame = getCancelAnimationFrame();

    function updateFrame() {
      setCount((prevCount: number) => {
        const newCount = prevCount + 1;
        if (newCount >= maxCount) {
          return prevCount;
        }
        rafId = requestAnimationFrame(updateFrame);
        return newCount;
      });
    }

    updateFrame();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [maxCount]);

  return function (n: number): boolean {
    return count >= n;
  };
}
```

### Vue 3 特定实现

```typescript
// src/frameworks/vue.ts
export function useDefer(maxCount = 100) {
  const Vue = require("vue");
  const { ref, onUnmounted } = Vue;

  const count = ref(0);
  let rafId: number | null = null;

  const requestAnimationFrame = getAnimationFrame();
  const cancelAnimationFrame = getCancelAnimationFrame();

  function updateFrame() {
    count.value++;
    if (count.value >= maxCount) {
      return;
    }
    rafId = requestAnimationFrame(updateFrame);
  }

  updateFrame();

  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  });

  return function (n: number): boolean {
    return count.value >= n;
  };
}
```

## 测试覆盖

- `src/__tests__/useDefer.test.ts` - 核心功能测试
- `src/__tests__/integration.test.ts` - 集成测试

## 使用示例

### React 使用

```jsx
import React from "react";
import { useReactDefer } from "@evander0x/use-defer";

function MyComponent() {
  const defer = useReactDefer(100);

  return (
    <div>
      {defer(30) && <p>这个内容在第 30 帧后显示</p>}
      {defer(60) && <p>这个内容在第 60 帧后显示</p>}
    </div>
  );
}
```

### Vue 3 使用

```vue
<template>
  <div>
    <p v-if="shouldShow">这个内容在第 30 帧后显示</p>
    <p v-if="shouldShowLater">这个内容在第 60 帧后显示</p>
  </div>
</template>

<script setup lang="ts">
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer(100);
const shouldShow = defer(30);
const shouldShowLater = defer(60);
</script>
```

### 框架无关使用

```javascript
import { useCoreDefer } from "@evander0x/use-defer";

const defer = useCoreDefer(100);
const shouldShow = defer(30);
```

## 构建和发布

### 构建

```bash
npm run build
```

### 发布

```bash
npm run publish
```

## 依赖管理

- 使用 `useReactDefer` 需要安装 `react` 依赖
- 使用 `useVueDefer` 需要安装 `vue` 依赖
- 推荐使用 `useCoreDefer` 如果你不需要特定框架的功能

## 浏览器兼容性

- **现代浏览器**: 使用原生的 `requestAnimationFrame`
- **旧版浏览器**: 自动降级到 `setTimeout` 模拟 60fps
- **Node.js 环境**: 同样使用 `setTimeout` 降级方案
