#!/bin/bash

# 发布脚本
echo "🚀 开始发布 use-defer..."

# 检查参数
if [ -z "$1" ]; then
    echo "❌ 请指定版本类型: patch, minor, major"
    echo "用法: ./scripts/release.sh [patch|minor|major]"
    exit 1
fi

VERSION_TYPE=$1

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 有未提交的更改，请先提交所有更改"
    exit 1
fi

# 运行测试
echo "🧪 运行测试..."
npm test

# 类型检查
echo "🔍 类型检查..."
npm run type-check

# 更新版本号
echo "📝 更新版本号..."
npm version $VERSION_TYPE

# 推送代码和标签
echo "📤 推送代码和标签..."
git push origin main
git push --tags

# 发布到 npm
echo "📦 发布到 npm..."
npm publish

echo "✅ 发布完成！"
echo "🎉 新版本已发布到 npm" 