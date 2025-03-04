"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    WinBox?:new (options: {
      title?: string;
      width?: string | number;
      height?: string | number;
      x?: string | number;
      y?: string | number;
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
      index?: number;
      mount?: HTMLElement;
      html?: string;
      modal?: boolean;
      hidden?: boolean;
      fullscreen?: boolean;
      noHeader?: boolean;
      noMin?: boolean;
      noMax?: boolean;
      noClose?: boolean;
      onclose?: () => boolean | void;
      onresize?: (width: number, height: number) => void;
      onmove?: (x: number, y: number) => void;
    }) => WinBoxInstance;
  }
}
interface WinBoxInstance {
  close(): void;
  focus(): void;
  setTitle(title: string): void;
}


export default function RetroWindow() {
  const [winboxLoaded, setWinboxLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.WinBox) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.min.js";
      script.async = true;
      script.onload = () => {
        setWinboxLoaded(true);
        console.log("WinBox script loaded.");
      };
      document.body.appendChild(script);
    } else {
      setWinboxLoaded(true);
    }
  }, []);

  const openWindow = () => {
    if (!window.WinBox) {
      console.error("WinBox is not loaded.");
      return;
    }

    new window.WinBox({
      title: "My Window",
      width: "400px",
      height: "300px",
      x: "center",
      y: "center",
    });
  };

  return (
    <div>
      <button onClick={openWindow} disabled={!winboxLoaded}>
        Open Window
      </button>
    </div>
  );
}
