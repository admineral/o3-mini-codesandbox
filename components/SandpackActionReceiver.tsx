// components/SandpackActionReceiver.tsx
"use client";

import { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Resizable } from "re-resizable";

interface SandpackActionReceiverProps {
  code: string;
}

export default function SandpackActionReceiver({ code }: SandpackActionReceiverProps) {
  const [size, setSize] = useState({
    width: 800,
    height: 500,
  });

  return (
    <Resizable
      size={size}
      onResizeStop={(e, direction, ref, d) => {
        setSize({
          width: size.width + d.width,
          height: size.height + d.height,
        });
      }}
      minWidth={400}
      minHeight={300}
      maxWidth={1200}
      maxHeight={800}
      className="relative border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden"
      handleStyles={{
        bottomRight: {
          bottom: 0,
          right: 0,
          cursor: "se-resize",
          height: "20px",
          width: "20px",
        },
      }}
      handleComponent={{
        bottomRight: (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-bl cursor-se-resize flex items-center justify-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 9L9 1M5 9L9 5M9 9L9 9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ),
      }}
    >
      <Sandpack
        template="react"
        files={{
          "/App.js": code,
        }}
        options={{
          showTabs: true,
          editorHeight: size.height - 2, // Subtract border width
          autoReload: true,
        }}
        theme="auto"
      />
    </Resizable>
  );
}