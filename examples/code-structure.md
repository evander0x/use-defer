# 代码结构说明

## 文件组织

```
src/
├── index.ts          # 主入口文件（自动框架检测）
├── core/             # 核心功能
│   ├── utils.ts      # 工具函数（requestAnimationFrame 降级逻辑）
│   └── core.ts       # 框架无关的核心实现
├── frameworks/       # 框架特定实现
│   ├── react.ts      # React 特定实现
│   └── vue.ts        # Vue 3 特定实现
└── __tests__/        # 测试文件
    ├── useDefer.test.ts
    ├── framework-detection.test.ts
    ├── utils.test.ts
    └── integration.test.ts
```

## 目录说明

### `src/index.ts` - 主入口

- 自动框架检测逻辑
- 智能选择相应的实现
- 导出所有公共 API

### `src/core/` - 核心功能

- `utils.ts`: 包含 `requestAnimationFrame` 降级逻辑的工具函数
- `core.ts`: 框架无关的核心实现，所有框架实现都基于此

### `src/frameworks/` - 框架特定实现

- `react.ts`: React 特定的 useDefer 实现
- `vue.ts`: Vue 3 特定的 useDefer 实现

## 代码复用

### 1. 工具函数抽离 (`src/core/utils.ts`)

将 `requestAnimationFrame` 降级逻辑抽离到 `utils.ts`，避免代码重复：

```typescript
// src/core/utils.ts
export const getAnimationFrame = () => {
  if (typeof requestAnimationFrame !== "undefined") {
    return requestAnimationFrame;
  }
  // 降级到 setTimeout，模拟 60fps
  return (callback: FrameRequestCallback) => {
    return setTimeout(callback, 1000 / 60) as unknown as number;
  };
};

export const getCancelAnimationFrame = () => {
  if (typeof cancelAnimationFrame !== "undefined") {
    return cancelAnimationFrame;
  }
  // 降级到 clearTimeout
  return (id: number) => {
    clearTimeout(id);
  };
};
```

### 2. 各框架实现复用工具函数

所有框架实现都导入并使用相同的工具函数：

```typescript
// src/frameworks/react.ts, src/frameworks/vue.ts, src/core/core.ts
import { getAnimationFrame, getCancelAnimationFrame } from "../core/utils";

// 使用统一的工具函数
const requestAnimationFrame = getAnimationFrame();
const cancelAnimationFrame = getCancelAnimationFrame();
```

## 优势

1. **清晰结构**: `src` 目录只包含入口文件，便于查看
2. **逻辑分离**: 核心功能、框架实现、工具函数分别放在不同目录
3. **代码复用**: 降级逻辑只写一次，所有实现共享
4. **维护性**: 修改降级逻辑只需要改一个地方
5. **一致性**: 所有框架实现使用相同的降级策略
6. **测试覆盖**: 工具函数有独立的测试

## 使用示例

```javascript
// 自动检测框架
import { useDefer } from "use-defer";
const defer = useDefer(100);

// 手动选择框架实现
import { useReactDefer, useVueDefer, useCoreDefer } from "use-defer";
const reactDefer = useReactDefer(100);
const vueDefer = useVueDefer(100);
const coreDefer = useCoreDefer(100);
```
