"use client";
import { useEffect } from "react";
// import Script from "next/script";

export default function Web2000() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/xp.css";
    document.head.appendChild(link);

    // Clean up on unmount to remove XP.css when leaving the page
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="window" style={{ width: 300 }}>
      <div className="title-bar">
        <div className="title-bar-text">Notepad</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <p>Hello World!</p>
      </div>
    </div>
  );
}
