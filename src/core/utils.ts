// 兼容性处理：当 requestAnimationFrame 不可用时使用 setTimeout
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
