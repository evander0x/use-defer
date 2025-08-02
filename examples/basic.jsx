import React from "react";
import { useReactDefer } from "../src/index";

function MyComponent() {
  const defer = useReactDefer(100);

  return (
    <div>
      <h1>useDefer React 示例</h1>
      {defer(0) && <p>这个内容在第 0 帧后显示</p>}
      {defer(10) && <p>这个内容在第 10 帧后显示</p>}
      {defer(30) && <p>这个内容在第 30 帧后显示</p>}
      {defer(60) && <p>这个内容在第 60 帧后显示</p>}
    </div>
  );
}

export default MyComponent;
