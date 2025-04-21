"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/WinBox";
// import { calendarInterval } from "@/store/useCalendarStore";
import gameContent from "@/data/Bazaar_log_game_content.json";
import { useGameStore, calendarInterval } from "@/store/gameStore";
type GameContentItem = (typeof gameContent)[number];

export default function NewsWindow({ era }: { era: string }) {
  const currentYear = useGameStore().currentYear;
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
    <WinBox id="lan" title="Local Area Network" width="600px" height="400px" era={era}>
      <div className="window-body">
        <h2>Local Area Network</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            {item.lan_posts && (item.lan_posts.length > 0) && <h3>{item.year}</h3>}
            {item.lan_posts?.map((lanObj, idx) => (
              <div key={idx}>
                <h4>{lanObj.title}</h4>
                <p>{lanObj.author}</p>
                <p>{lanObj.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </WinBox>
  );
}
