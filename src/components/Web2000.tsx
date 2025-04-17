"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect } from "react";
import CalendarWindow from "./windows/calendar";
import DashboardWindow from "./windows/dashboard";
import NewsWindow from "./windows/news";
import NotebookWindow from "./windows/notebook";
import LANWindow from "./windows/lan";

export default function Web2000() {
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/xp.css";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const eraStr = "2000s";

  return isClient ? (
    <div className="grid grid-cols-6 gap-4">
      <div
        className="absolute top-4 right-4 justify-items-center border border-black"
        style={{ background: "#D9D9D9", color: "#000", fontFamily: "Ohlfs" }}
      >
        <div className="border border-black w-full">
          <DashboardWindow era={eraStr} />
        </div>

        <div className="border border-black w-full">
          <NewsWindow era={eraStr} />
        </div>
        <div className="border border-black w-full">
          <NotebookWindow era={eraStr} />
        </div>
        <div className="border border-black w-full">
          <LANWindow era={eraStr} />
        </div>
        <div className="border border-black w-full">
          <CalendarWindow era={eraStr} />
        </div>
      </div>
    </div>
  ) : null;
}
