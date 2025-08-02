import React, { useState, useEffect } from "react";
import { useDefer } from "../src/index";

function BasicExample() {
  const [frameCount, setFrameCount] = useState(0);
  const defer = useDefer(100);

  // 创建一个响应式的帧计数器
  useEffect(() => {
    const updateFrameCount = () => {
      setFrameCount((prev) => {
        const newCount = prev + 1;
        if (newCount < 100) {
          requestAnimationFrame(updateFrameCount);
        }
        return newCount;
      });
    };

    updateFrameCount();
  }, []);

  return (
    <div className="container">
      <h1>useDefer React 示例</h1>

      <div className="frame-counter">
        <p>当前帧数: {frameCount}</p>
      </div>

      <div className="content-sections">
        <div className={`section ${true ? "visible" : ""}`}>
          <h3>立即显示</h3>
          <p>这个内容会立即显示</p>
        </div>

        <div className={`section ${defer(10) ? "visible" : ""}`}>
          <h3>10帧后显示</h3>
          <p>这个内容会在第10帧后显示</p>
        </div>

        <div className={`section ${defer(30) ? "visible" : ""}`}>
          <h3>30帧后显示</h3>
          <p>这个内容会在第30帧后显示</p>
        </div>

        <div className={`section ${defer(60) ? "visible" : ""}`}>
          <h3>60帧后显示</h3>
          <p>这个内容会在第60帧后显示</p>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}

export default BasicExample;
