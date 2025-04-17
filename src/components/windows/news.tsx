"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/WinBox";
import { useCalendarStore, calendarInterval } from "@/store/useCalendarStore";
import gameContent from "@/data/Bazaar_log_game_content.json";
type GameContentItem = (typeof gameContent)[number];

export default function NewsWindow({ era }: { era: string }) {
  const { currentYear } = useCalendarStore();
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/xp.css";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);
  return (
    <WinBox id="news" title="News" width="600px" height="400px" era={era}>
      <div className="window-body">
        <h2>Open Source Daily</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            <p>{item.year}</p>
            {item.news?.map((newsObj, idx) => (
              <div key={idx}>
                <h3>{newsObj.headline}</h3>
                <p>{newsObj.summary}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </WinBox>
  );
}
