"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/windows/WinBox";
// import { calendarInterval } from "@/store/useCalendarStore";
import gameContent from "@/data/Bazaar_log_game_content.json";
import DecisionModal from "../ui/contentDecision";
import { useGameStore, calendarInterval } from "@/store/gameStore";
interface NewsItem {
  headline: string;
  summary: string;
  decisionTrigger?: string; // optional
}

interface GameContentItem {
  year: number;
  news?: NewsItem[];
  notebook?: string[];
  calendar?: string;
  lan?: string[];
  workstation?: string;
}

export default function NewsWindow({ era }: { era: string }) {
  const currentYear = useGameStore().currentYear;
  const [currentContentList, setCurrentContentList] = useState<
    GameContentItem[]
  >([]);
  const decisions = useGameStore((state) => state.contentDecisions);
  useEffect(() => {
    const startYear = currentYear - (calendarInterval - 1);
    const filteredContent = gameContent.filter((item) => {
      return item.year >= startYear && item.year <= currentYear;
    });
    filteredContent.sort((a, b) => a.year - b.year);
    setCurrentContentList(filteredContent);
  }, [currentYear]);

  const [showDecision, setShowDecision] = useState(false);
  const [currentTriggerId, setCurrentTriggerId] = useState<string | null>(null);

  return (
    <WinBox id="news" title="News" width="600px" height="400px" era={era}>
      <div className="window-body">
        <h2>Open Source Daily</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            {item.news && item.news.length > 0 && <p>{item.year}</p>}
            {item.news?.map((newsObj, idx) => (
              <div key={idx}>
                <h3>{newsObj.headline}</h3>
                <p>{newsObj.summary}</p>
                {newsObj.decisionTrigger &&
                  !decisions[newsObj.decisionTrigger] && (
                    <button
                      onClick={() => {
                        setCurrentTriggerId(newsObj.decisionTrigger!);
                        setShowDecision(true);
                      }}
                    >
                      Decide Your Response
                    </button>
                  )}
              </div>
            ))}
          </div>
        ))}

        {showDecision && currentTriggerId && (
          <DecisionModal
            triggerId={currentTriggerId}
            onClose={() => {
              setShowDecision(false);
              setCurrentTriggerId(null);
            }}
          />
        )}
      </div>
    </WinBox>
  );
}
