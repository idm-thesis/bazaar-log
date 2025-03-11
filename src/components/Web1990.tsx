"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useTimeBasedUpdates } from "@/hooks/useTimeBasedUpdates";
import { useState, useEffect } from "react";
import CalendarWindow from "./windows/calendar";
import DashboardWindow from "./windows/dashboard";
import NewsWindow from "./windows/news";
import NotebookWindow from "./windows/notebook";
import LANWindow from "./windows/lan";

export default function Web1990() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  useTimeBasedUpdates();

  return isClient ? (
    <div className="grid grid-cols-6 gap-4">
      <div
        className="absolute top-4 right-4 justify-items-center space-y-2"
        style={{ background: "#D9D9D9", color: "#000" }}
      >
        <DashboardWindow era="1990s-2000s"/>
        <NewsWindow />
        <NotebookWindow />
        <LANWindow />
        <CalendarWindow />
      </div>
    </div>
  ) : null;
}
