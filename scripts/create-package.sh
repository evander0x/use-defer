#!/bin/bash

# npm 包模板生成脚本
# 使用方法: ./scripts/create-package.sh package-name

PACKAGE_NAME=$1
AUTHOR_NAME=${2:-"Your Name"}
AUTHOR_EMAIL=${3:-"your.email@example.com"}

if [ -z "$PACKAGE_NAME" ]; then
    echo "❌ 请提供包名"
    echo "使用方法: $0 package-name [author-name] [author-email]"
    exit 1
fi

echo "🚀 创建 npm 包: $PACKAGE_NAME"

# 创建项目目录
mkdir $PACKAGE_NAME
cd $PACKAGE_NAME

# 初始化 Git
git init

# 创建目录结构
mkdir -p src tests examples docs scripts

# 创建 package.json
cat > package.json << EOF
{
  "name": "$PACKAGE_NAME",
  "version": "1.0.0",
  "description": "A Vue 3 composable",
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
  "keywords": ["vue", "composable", "hook"],
  "author": {
    "name": "$AUTHOR_NAME",
    "email": "$AUTHOR_EMAIL"
  },
  "license": "MIT",
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vue": "^3.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0"
  }
}
EOF

# 创建 tsconfig.json
cat > tsconfig.json << EOF
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
EOF

# 创建 tsup.config.ts
cat > tsup.config.ts << EOF
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue'],
})
EOF

# 创建 vitest.config.ts
cat > vitest.config.ts << EOF
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
EOF

# 创建主要代码文件
cat > src/index.ts << EOF
import { ref, onUnmounted } from 'vue'

/**
 * Your composable function
 * @param maxCount - Maximum count
 * @returns A function that returns true when count reaches the specified number
 */
export function useYourFunction(maxCount = 100) {
  const count = ref(0)
  let rafId: number | null = null

  function updateFrame() {
    count.value++
    if (count.value >= maxCount) {
      return
    }
    rafId = requestAnimationFrame(updateFrame)
  }

  updateFrame()

  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  })

  return function (n: number): boolean {
    return count.value >= n
  }
}

export default useYourFunction
EOF

# 创建测试文件
cat > src/__tests__/useYourFunction.test.ts << EOF
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useYourFunction } from '../index'

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn()
const mockCancelAnimationFrame = vi.fn()

global.requestAnimationFrame = mockRequestAnimationFrame
global.cancelAnimationFrame = mockCancelAnimationFrame

describe('useYourFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a function', () => {
    const func = useYourFunction()
    expect(typeof func).toBe('function')
  })

  it('should accept maxCount parameter', () => {
    const func = useYourFunction(5)
    expect(typeof func).toBe('function')
  })

  it('should use default maxCount of 100', () => {
    const func = useYourFunction()
    expect(typeof func).toBe('function')
  })
})
EOF

# 创建 README.md
cat > README.md << EOF
# $PACKAGE_NAME

A Vue 3 composable for deferring operations using requestAnimationFrame.

## Installation

\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

## Usage

\`\`\`vue
<template>
  <div>
    <p v-if="shouldShow">This content shows after 30 frames</p>
  </div>
</template>

<script setup lang="ts">
import { useYourFunction } from '$PACKAGE_NAME'

const defer = useYourFunction(100)
const shouldShow = defer(30)
</script>
\`\`\`

## API

### useYourFunction(maxCount?: number)

Creates a defer function.

#### Parameters

- \`maxCount\` (optional): Maximum frame count, defaults to 100

#### Returns

Returns a function that accepts a number parameter \`n\` and returns \`true\` when the current frame count is greater than or equal to \`n\`.

## License

MIT
EOF

# 创建 .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.DS_Store
*.log
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
coverage/
.vscode/
.idea/
*.tsbuildinfo
EOF

# 创建发布脚本
cat > scripts/publish.sh << EOF
#!/bin/bash

echo "🚀 开始发布 $PACKAGE_NAME..."

# 检查是否有未提交的更改
if [ -n "\$(git status --porcelain)" ]; then
    echo "❌ 有未提交的更改，请先提交所有更改"
    exit 1
fi

# 运行测试
echo "🧪 运行测试..."
npm test

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

# 发布到 npm
echo "📦 发布到 npm..."
npm publish

echo "✅ 发布完成！"
EOF

chmod +x scripts/publish.sh

# 安装依赖
echo "📦 安装依赖..."
npm install

echo "✅ 项目创建完成！"
echo ""
echo "📁 项目结构:"
echo "  ├── src/"
echo "  │   ├── index.ts"
echo "  │   └── __tests__/"
echo "  ├── examples/"
echo "  ├── docs/"
echo "  ├── scripts/"
echo "  ├── package.json"
echo "  ├── tsconfig.json"
echo "  ├── tsup.config.ts"
echo "  ├── vitest.config.ts"
echo "  └── README.md"
echo ""
echo "🚀 下一步:"
echo "  1. cd $PACKAGE_NAME"
echo "  2. npm run build"
echo "  3. npm test"
echo "  4. npm login"
echo "  5. npm publish"
echo ""
echo "📚 查看详细文档: docs/publishing-guide.md" 