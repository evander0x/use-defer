# use-defer 代码结构说明

## 项目结构

```
use-defer/
├── src/
│   ├── core/
│   │   ├── core.ts          # 框架无关的核心实现
│   │   └── utils.ts         # 工具函数（requestAnimationFrame 兼容性）
│   ├── frameworks/
│   │   ├── react.ts         # React 特定的 useDefer 实现
│   │   └── vue.ts           # Vue 3 特定的 useDefer 实现
│   ├── __tests__/
│   │   ├── useDefer.test.ts # 核心功能测试
│   │   └── integration.test.ts # 集成测试
│   └── index.ts             # 主入口文件，导出所有实现
├── examples/
│   ├── basic.jsx            # React 使用示例
│   ├── basic.vue            # Vue 3 使用示例
│   ├── test-usage.js        # 基本使用示例
│   └── code-structure.md    # 本文档
├── docs/
│   ├── summary.md           # 项目总结
│   ├── quick-reference.md   # 快速参考
│   └── publishing-guide.md  # 发布指南
├── scripts/
│   ├── create-package.sh    # 创建包的脚本
│   ├── publish.sh           # 发布脚本
│   └── release.sh           # 发布脚本
├── package.json             # 包配置
├── tsconfig.json            # TypeScript 配置
├── tsup.config.ts           # 构建配置
├── vitest.config.ts         # 测试配置
└── README.md                # 项目文档
```

## 核心文件说明

### 1. src/core/core.ts

框架无关的核心实现，不依赖任何特定框架。

**主要功能：**

- 使用 `requestAnimationFrame` 计数动画帧
- 提供清理机制
- 支持自定义最大帧数

**关键特性：**

- 纯函数实现
- 无外部依赖
- 适用于任何 JavaScript 环境

### 2. src/core/utils.ts

提供 `requestAnimationFrame` 的兼容性处理。

**主要功能：**

- 检测浏览器环境
- 提供降级方案（setTimeout）
- 统一 API 接口

### 3. src/frameworks/react.ts

React 特定的实现，利用 React 的生命周期管理。

**主要功能：**

- 使用 `useState` 管理状态
- 使用 `useEffect` 处理副作用
- 自动清理资源

### 4. src/frameworks/vue.ts

Vue 3 特定的实现，利用 Vue 的响应式系统。

**主要功能：**

- 使用 `ref` 管理响应式状态
- 使用 `onUnmounted` 处理清理
- 集成 Vue 3 组合式 API

### 5. src/index.ts

主入口文件，导出所有可用的实现。

**导出内容：**

- `useCoreDefer` - 框架无关实现
- `useReactDefer` - React 特定实现
- `useVueDefer` - Vue 3 特定实现
- `default` - 默认导出（使用核心实现）

## 使用方式

### 框架无关使用（推荐）

```javascript
import { useCoreDefer } from "@evander0x/use-defer";

const defer = useCoreDefer(100);
const shouldShow = defer(30);
```

### React 使用

```jsx
import { useReactDefer } from "@evander0x/use-defer";

function MyComponent() {
  const defer = useReactDefer(100);
  return <div>{defer(30) && <p>30帧后显示</p>}</div>;
}
```

### Vue 3 使用

```vue
<script setup>
import { useVueDefer } from "@evander0x/use-defer";

const defer = useVueDefer(100);
const shouldShow = defer(30);
</script>

<template>
  <div>
    <p v-if="shouldShow">30帧后显示</p>
  </div>
</template>
```

## 依赖管理

- **useCoreDefer**: 无额外依赖
- **useReactDefer**: 需要安装 `react`
- **useVueDefer**: 需要安装 `vue`

## 构建输出

使用 tsup 构建，生成以下文件：

- `dist/index.js` - CommonJS 格式
- `dist/index.mjs` - ESM 格式
- `dist/index.d.ts` - TypeScript 类型定义

## 测试覆盖

- **单元测试**: 测试核心功能
- **集成测试**: 测试不同实现的兼容性
- **类型测试**: 确保 TypeScript 类型正确

## 浏览器兼容性

- **现代浏览器**: 使用原生 `requestAnimationFrame`
- **旧版浏览器**: 降级到 `setTimeout` 模拟 60fps
- **Node.js**: 使用 `setTimeout` 降级方案
