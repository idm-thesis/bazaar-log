"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/WinBox";
// import { useCalendarStore, calendarInterval } from "@/store/useCalendarStore";
import { useGameStore, calendarInterval } from "@/store/gameStore";
import gameContent from "@/data/Bazaar_log_game_content.json";
type GameContentItem = (typeof gameContent)[number];

export default function NewsWindow({ era }: { era: string }) {
  const { currentYear } = useGameStore();
  const [currentContentList, setCurrentContentList] = useState<
    GameContentItem[]
  >([]);
  useEffect(() => {
    const startYear = currentYear - (calendarInterval - 1);
    const filteredContent = gameContent.filter((item) => {
      return item.year >= startYear && item.year <= currentYear;
    });
    filteredContent.sort((a, b) => a.year - b.year);
    setCurrentContentList(filteredContent);
  }, [currentYear]);
  return (
    <WinBox id="notebook" title="Notebook" width="600px" height="400px" era={era}>
      <div className="window-body">
        <h2>Notebook</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            {item.notebook && (item.notebook.length > 0) && <p>{item.year}</p>}
            <ul>
              {item.notebook?.map((notebookObj, idx) => (
                <li key={idx}>{notebookObj}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </WinBox>
  );
}
