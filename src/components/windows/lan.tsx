"use client";
import WinBox from "@/components/WinBox";
// import { useCalendarStore } from "@/store/useCalendarStore";

export default function LANWindow() {
  return (
    <WinBox id="lan" title="Local Area Network" width="600px" height="400px">
      <div className="p-4">
        <h2 className="text-lg font-bold">Local Area Network</h2>
        <p>Discover how open-source communities revolutionized software.</p>
      </div>
    </WinBox>
  );
}
