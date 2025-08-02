# npm 包发布完整指南

从零开始创建并发布一个 npm 包的完整流程。

## 📋 目录

1. [项目初始化](#项目初始化)
2. [包配置](#包配置)
3. [代码实现](#代码实现)
4. [构建配置](#构建配置)
5. [测试设置](#测试设置)
6. [文档编写](#文档编写)
7. [发布准备](#发布准备)
8. [发布流程](#发布流程)
9. [常见问题](#常见问题)

## 🚀 项目初始化

### 1. 创建项目目录

```bash
mkdir my-npm-package
cd my-npm-package
```

### 2. 初始化 Git 仓库

```bash
git init
```

### 3. 创建基础文件结构

```
my-npm-package/
├── src/
│   └── index.ts          # 主要代码
├── dist/                 # 构建输出 (自动生成)
├── docs/                 # 文档
├── examples/             # 示例
├── scripts/              # 脚本
├── tests/                # 测试
├── package.json          # 包配置
├── tsconfig.json         # TypeScript 配置
├── README.md             # 项目文档
└── .gitignore            # Git 忽略文件
```

## 📦 包配置

### 1. 创建 package.json

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "包描述",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "prepublishOnly": "npm run build",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["相关关键词"],
  "author": {
    "name": "你的名字",
    "email": "你的邮箱"
  },
  "license": "MIT",
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0"
  }
}
```

### 2. 配置 TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2020", "DOM"],
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## 💻 代码实现

### 1. 主要代码文件

```typescript
// src/index.ts
import { ref, onUnmounted } from "vue";

/**
 * 你的函数描述
 * @param maxCount - 参数描述
 * @returns 返回值描述
 */
export function useYourFunction(maxCount = 100) {
  const count = ref(0);
  let rafId: number | null = null;

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

export default useYourFunction;
```

### 2. 构建配置

```typescript
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["vue"], // 外部依赖
});
```

## 🧪 测试设置

### 1. 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

### 2. 测试文件

```typescript
// src/__tests__/your-function.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useYourFunction } from "../index";

describe("useYourFunction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a function", () => {
    const func = useYourFunction();
    expect(typeof func).toBe("function");
  });

  // 更多测试...
});
```

## 📚 文档编写

### 1. README.md 模板

````markdown
# 包名

包描述

## 安装

```bash
npm install your-package-name
```
````

## 使用方法

```vue
<script setup>
import { useYourFunction } from "your-package-name";

const func = useYourFunction();
</script>
```

## API

### useYourFunction(maxCount?: number)

函数描述

#### 参数

- `maxCount` (可选): 参数描述

#### 返回值

返回值描述

## 许可证

MIT

````

## 🔧 发布准备

### 1. 安装依赖
```bash
npm install
````

### 2. 构建项目

```bash
npm run build
```

### 3. 运行测试

```bash
npm test
```

### 4. 检查包名可用性

```bash
npm view your-package-name
```

如果返回 404 错误，说明包名可用。

### 5. 创建 .gitignore

```
node_modules/
dist/
.DS_Store
*.log
.env
coverage/
.vscode/
.idea/
*.tsbuildinfo
```

## 🚀 发布流程

### 1. 登录 npm

```bash
npm login
```

### 2. 检查登录状态

```bash
npm whoami
```

### 3. 发布包

```bash
npm publish
```

### 4. 验证发布

```bash
npm view your-package-name
```

## 🔄 更新版本

### 1. 更新版本号

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. 重新发布

```bash
npm publish
```

## ❓ 常见问题

### 1. 包名被占用

**问题**: `npm publish` 返回 403 错误
**解决**: 更换包名或使用作用域包名

```json
{
  "name": "@your-username/package-name"
}
```

### 2. 权限问题

**问题**: 发布时提示权限不足
**解决**:

```bash
npm login
npm whoami  # 确认登录用户
```

### 3. 构建失败

**问题**: `npm run build` 失败
**解决**:

- 检查 TypeScript 配置
- 确认所有依赖已安装
- 检查代码语法错误

### 4. 测试失败

**问题**: `npm test` 失败
**解决**:

- 检查测试环境配置
- 确认测试依赖已安装
- 检查测试代码逻辑

## 📋 发布检查清单

- [ ] 包名可用且符合规范
- [ ] package.json 配置正确
- [ ] 代码实现完成
- [ ] 测试通过
- [ ] 构建成功
- [ ] 文档完整
- [ ] 已登录 npm
- [ ] 版本号正确
- [ ] 所有文件已提交到 Git

## 🎯 最佳实践

1. **包名选择**: 使用描述性且唯一的包名
2. **版本管理**: 遵循语义化版本控制
3. **文档质量**: 提供清晰的使用示例
4. **测试覆盖**: 确保核心功能有测试
5. **类型支持**: 提供完整的 TypeScript 类型定义
6. **构建优化**: 使用现代构建工具
7. **持续集成**: 设置自动化测试和发布流程

## 🔗 相关资源

- [npm 官方文档](https://docs.npmjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Vue 3 文档](https://vuejs.org/)
- [tsup 文档](https://tsup.egoist.dev/)
- [Vitest 文档](https://vitest.dev/)
