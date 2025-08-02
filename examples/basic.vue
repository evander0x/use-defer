<template>
  <div>
    <h1>useDefer 示例</h1>
    <p v-if="showImmediate">这个内容会立即显示</p>
    <p v-if="showAfter10Frames">这个内容会在第10帧后显示</p>
    <p v-if="showAfter30Frames">这个内容会在第30帧后显示</p>
    <p v-if="showAfter60Frames">这个内容会在第60帧后显示</p>
  </div>
</template>

<script setup lang="ts">
import { useVueDefer } from "../src/index";

const defer = useVueDefer(100);

// 检查是否应该显示内容
const showImmediate = true;
const showAfter10Frames = defer(10);
const showAfter30Frames = defer(30);
const showAfter60Frames = defer(60);
</script>

<style scoped>
div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

p {
  padding: 15px;
  margin: 10px 0;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #007acc;
  transition: all 0.3s ease;
}

p:hover {
  background: #e8f4fd;
  transform: translateX(5px);
}
</style>
