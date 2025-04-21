"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect } from "react";
import CalendarWindow from "./windows/calendar";
import DashboardWindow from "./windows/workstation";
import NewsWindow from "./windows/news";
import NotebookWindow from "./windows/notebook";
import LANWindow from "./windows/lan";

export default function Web1990() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const eraStr = "1990s";

  return isClient ? (
    <div className="grid grid-cols-6 gap-4">
      <div
        className="absolute top-4 right-4 justify-items-center border-4 border-black"
        style={{ background: "#000", color: "#000", fontFamily: "Ohlfs" }}
      >
        <div className="border-2 border-t-white border-l-white w-full mb-1" style={{borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B"}}>
          <DashboardWindow era={eraStr} />
        </div>

        <div className="border-2 border-t-white border-l-white w-full mb-1" style={{borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B"}}>
          <NewsWindow era={eraStr} />
        </div>
        <div className="border-2 border-t-white border-l-white w-full mb-1" style={{borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B"}}>
          <NotebookWindow era={eraStr} />
        </div>
        <div className="border-2 border-t-white border-l-white w-full mb-1" style={{borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B"}}>
          <LANWindow era={eraStr} />
        </div>
        <div className="border-2 border-t-white border-l-white w-full" style={{borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B"}}>
          <CalendarWindow era={eraStr} />
        </div>
      </div>
    </div>
  ) : null;
}
