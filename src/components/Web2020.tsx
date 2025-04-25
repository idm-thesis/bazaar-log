"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect } from "react";
import CalendarWindow from "./windows/calendar";
import Workstation from "./windows/workstation";
import NewsWindow from "./windows/news";
import NotebookWindow from "./windows/notebook";
import LANWindow from "./windows/lan";
import { useWinBoxStore } from "@/store/useWinBoxStore";

export default function Web2020() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    useWinBoxStore.getState().clearAllBoxes();
  }, []);

  const eraStr = "2020s";

  return isClient ? (
    <div className="relative h-screen">
      <div
        className="absolute top-4 left-6"
      >
        <div className="justify-items-center mb-4" style={{width: 50}}>
          <NotebookWindow era={eraStr} />
          <b className="text-white text-xs text-wrap">Notebook</b>
        </div>
        <div className="justify-items-center mb-4" style={{width: 50}}>
          <NewsWindow era={eraStr} />
          <b className="text-white text-xs text-wrap">News</b>
        </div>
        <div className="justify-items-center mb-4" style={{width: 50}}>
          <LANWindow era={eraStr} />
          <b className="block w-full text-white text-xs text-center break-words">Local Area Network</b>
        </div>
        <div className="justify-items-center mb-4" style={{width: 50}}>
          <CalendarWindow era={eraStr} />
          <b className="text-white text-xs text-wrap">Calendar</b>
        </div>
        <div className="justify-items-center mb-4" style={{width: 50}}>
          <Workstation era={eraStr} />
          <b className="text-white text-xs text-wrap">Workstation</b>
        </div>
      </div>
      <div id="bar2020"></div>
    </div>
  ) : null;
}
