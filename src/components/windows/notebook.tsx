"use client";
import WinBox from "@/components/WinBox";
// import { useCalendarStore } from "@/store/useCalendarStore";

export default function NotebookWindow({era}: {era: string}) {
  return (
    <WinBox id="notebook" title="Notebook" width="600px" height="400px" era={era}>
      <div className="p-4">
        <h2 className="text-lg font-bold">Notebook</h2>
        <ol className="ml-4 list-decimal">
          <li>hello</li>
        </ol>
      </div>
    </WinBox>
  );
}
