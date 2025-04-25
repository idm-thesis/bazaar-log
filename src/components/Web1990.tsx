"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect } from "react";
import CalendarWindow from "./windows/calendar";
import Workstation from "./windows/workstation";
import NewsWindow from "./windows/news";
import NotebookWindow from "./windows/notebook";
import LANWindow from "./windows/lan";
import { useWinBoxStore } from "@/store/useWinBoxStore";

export default function Web1990() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    useWinBoxStore.getState().clearAllBoxes();
  }, []);
  const eraStr = "1990s";

  return isClient ? (
    <div className="relative h-screen">
      <div
        className="absolute top-4 right-4"
        style={{ background: "#000", color: "#000", fontFamily: "Ohlfs" }}
      >
        <div
          className="justify-items-center border-2 border-t-white border-l-white m-1 flex justify-center"
          style={{ borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B" }}
        >
          <NotebookWindow era={eraStr} />
        </div>
        <div
          className="justify-items-center border-2 border-t-white border-l-white m-1 flex justify-center"
          style={{ borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B" }}
        >
          <NewsWindow era={eraStr} />
        </div>
        <div
          className="justify-items-center border-2 border-t-white border-l-white m-1 flex justify-center"
          style={{ borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B" }}
        >
          <LANWindow era={eraStr} />
        </div>
        <div
          className="justify-items-center border-2 border-t-white border-l-white m-1 flex justify-center"
          style={{ borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B" }}
        >
          <CalendarWindow era={eraStr} />
        </div>
        <div
          className="justify-items-center border-2 border-t-white border-l-white m-1 flex justify-center"
          style={{ borderRightColor: "#6B6B6B", borderBottomColor: "#6B6B6B" }}
        >
          <Workstation era={eraStr} />
        </div>
      </div>
    </div>
  ) : null;
}
