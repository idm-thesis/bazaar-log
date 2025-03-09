"use client";

import React, {
  useEffect,
  useState,
  ReactNode,
  useRef,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    WinBox?: new (options: {
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
interface WinBoxProps {
  id: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  x?: string | number;
  y?: string | number;
  children?: ReactNode;
  content?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Window({
  title = "My Window",
  width = "800px",
  height = "600px",
  x = "center",
  y = "center",
  children,
  className = "",
}: WinBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const winboxRef = useRef<WinBoxInstance | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  // const winboxInstances = useRef<WinBoxInstance[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.WinBox) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.min.js";
      script.async = true;
      script.onload = () => {console.log("WinBox script loaded.");};
      document.body.appendChild(script);
    }
  }, []);

  const openWindow = () => {
    if (!window.WinBox) {
      console.error("WinBox is not loaded.");
      return;
    }

    setIsOpen(true);

    // Create a container div if not already present
    if (!contentRef.current) {
      contentRef.current = document.createElement("div");
    }

    winboxRef.current = new window.WinBox({
      title,
      width,
      height,
      x,
      y,
      mount: contentRef.current, // Mounts React content inside WinBox
      onclose: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <div className={`${className}`}>
      <button
        onClick={openWindow}
        disabled={isOpen}
        className={`p-2 w-full justify-self-end ${
          isOpen
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:text-gray-400"
        }`}
      >
        {title}
      </button>
      {contentRef.current && createPortal(children, contentRef.current)}
    </div>
  );
}
