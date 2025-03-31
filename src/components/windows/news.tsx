"use client";
import WinBox from "@/components/WinBox";
// import { useCalendarStore } from "@/store/useCalendarStore";

export default function NewsWindow({era}: {era:string}) {
  return (
    <WinBox id="news" title="News" width="600px" height="400px" era={era}>
      <div className="p-4">
        <h2 className="text-lg font-bold">Open Source Daily</h2>
        <p>Welcome to Open Source Daily news.</p>
      </div>
    </WinBox>
  );
}
