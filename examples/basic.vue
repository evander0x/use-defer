<template>
  <div class="container">
    <h1>useDefer 示例</h1>

    <div class="frame-counter">
      <p>当前帧数: {{ frameCount }}</p>
    </div>

    <div class="content-sections">
      <div class="section" :class="{ visible: showImmediate }">
        <h3>立即显示</h3>
        <p>这个内容会立即显示</p>
      </div>

      <div class="section" :class="{ visible: showAfter10Frames }">
        <h3>10帧后显示</h3>
        <p>这个内容会在第10帧后显示</p>
      </div>

      <div class="section" :class="{ visible: showAfter30Frames }">
        <h3>30帧后显示</h3>
        <p>这个内容会在第30帧后显示</p>
      </div>

      <div class="section" :class="{ visible: showAfter60Frames }">
        <h3>60帧后显示</h3>
        <p>这个内容会在第60帧后显示</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useDefer } from "../src/index";

const defer = useDefer(100);

const frameCount = ref(0);

// 创建一个响应式的帧计数器
const updateFrameCount = () => {
  frameCount.value++;
  if (frameCount.value < 100) {
    requestAnimationFrame(updateFrameCount);
  }
};

onMounted(() => {
  updateFrameCount();
});

// 检查是否应该显示内容
const showImmediate = ref(true);
const showAfter10Frames = computed(() => defer(10));
const showAfter30Frames = computed(() => defer(30));
const showAfter60Frames = computed(() => defer(60));
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.frame-counter {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.frame-counter p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.content-sections {
  display: grid;
  gap: 20px;
}

.section {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.section p {
  margin: 0;
  color: #666;
}
</style>
