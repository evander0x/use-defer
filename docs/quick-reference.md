# npm 包发布快速参考

## 🚀 关键步骤速查

### 1. 项目初始化

```bash
mkdir my-package && cd my-package
git init
npm init -y
```

### 2. 安装核心依赖

```bash
npm install --save-dev typescript tsup vitest jsdom @types/node
npm install --save-dev vue  # 如果是 Vue 包
```

### 3. 创建基础文件

**package.json** (关键配置)

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
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
    "prepublishOnly": "npm run build",
    "test": "vitest"
  }
}
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

**tsup.config.ts**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["vue"],
});
```

### 4. 编写代码

```typescript
// src/index.ts
export function yourFunction() {
  // 你的代码
}

export default yourFunction;
```

### 5. 测试

```typescript
// src/__tests__/your-function.test.ts
import { describe, it, expect } from "vitest";
import { yourFunction } from "../index";

describe("yourFunction", () => {
  it("should work", () => {
    expect(yourFunction()).toBeDefined();
  });
});
```

### 6. 发布前检查

```bash
# 检查包名可用性
npm view your-package-name

# 构建
npm run build

# 测试
npm test

# 登录 npm
npm login

# 发布
npm publish
```

## ⚡ 一键发布脚本

```bash
#!/bin/bash
# publish.sh

echo "🚀 开始发布..."

# 检查包名
npm view $PACKAGE_NAME 2>/dev/null && {
  echo "❌ 包名 $PACKAGE_NAME 已被占用"
  exit 1
}

# 构建
npm run build

# 测试
npm test

# 发布
npm publish

echo "✅ 发布完成！"
```

## 🔧 常见问题解决

| 问题       | 解决方案                                |
| ---------- | --------------------------------------- |
| 包名被占用 | 更换包名或使用 `@username/package-name` |
| 权限不足   | `npm login` 重新登录                    |
| 构建失败   | 检查 TypeScript 配置和依赖              |
| 测试失败   | 安装 `jsdom` 和检查测试环境             |

## 📋 发布检查清单

- [ ] 包名可用 (`npm view package-name`)
- [ ] 代码实现完成
- [ ] 测试通过 (`npm test`)
- [ ] 构建成功 (`npm run build`)
- [ ] 文档完整 (README.md)
- [ ] 已登录 npm (`npm whoami`)
- [ ] 版本号正确
- [ ] 所有文件已提交 Git

## 🎯 最佳实践

1. **包名**: 使用描述性名称，避免冲突
2. **版本**: 遵循语义化版本 (semver)
3. **文档**: 提供清晰的使用示例
4. **测试**: 覆盖核心功能
5. **类型**: 提供 TypeScript 类型定义
6. **构建**: 支持 ESM 和 CommonJS
7. **依赖**: 正确设置 peerDependencies

## 📦 发布后验证

```bash
# 检查包是否发布成功
npm view your-package-name

# 测试安装
npm install your-package-name

# 验证使用
node -e "console.log(require('your-package-name'))"
```
