"use client";
import WinBox from "@/components/windows/WinBox";
import { maxYear, useGameStore } from "@/store/gameStore";
import { hasPendingDecisions } from "../blockForDecision/blockForDecision";

export default function CalendarWindow({era}: {era: string}) {
  const { currentYear, nextYear, calendarInterval, setGameStage, decisionStatusList } = useGameStore();
  const nextYearAction = () => {
    if (currentYear + calendarInterval <= maxYear) {
      nextYear();
    } else {
      setGameStage('future');
    }
  }
  const blockingForDecision = () => {
    window.alert("Failed to move forward in time: You have pending decision(s) in this era.");
  }
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
        <h2 className="text-4xl font-bold text-center justify-center">
          Year <br />
          {currentYear}
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => (hasPendingDecisions(currentYear, decisionStatusList, calendarInterval) ? blockingForDecision() : nextYearAction())}
            className="p-2 bg-gray-300 hover:bg-gray-400"
          >
            Next Year
          </button>
        </div>
      </div>
    </WinBox>
  );
}
