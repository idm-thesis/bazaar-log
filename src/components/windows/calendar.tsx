"use client";
import WinBox from "@/components/WinBox";
import { useCalendarStore } from "@/store/useCalendarStore";

export default function CalendarWindow({era}: {era: string}) {
  const { currentYear, nextYear } = useCalendarStore();
  return (
    <WinBox id="calendar" title="Calendar" width="600px" height="400px" era={era}>
      <div className="p-4 grid grid-cols-1 justify-center">
        {/* <div className="flex justify-center mt-4">
          <button
            onClick={prevYear}
            className="p-2 bg-gray-300 hover:bg-gray-400"
          >
            Previous Year
          </button>
        </div> */}
        <h2 className="text-4xl font-bold text-center">
          Year <br />
          {currentYear}
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={nextYear}
            className="p-2 bg-gray-300 hover:bg-gray-400"
          >
            Next Year
          </button>
        </div>
      </div>
    </WinBox>
  );
}
