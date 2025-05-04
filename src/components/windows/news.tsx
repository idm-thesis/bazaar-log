"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/windows/WinBox";
import gameContent from "@/data/Bazaar_log_game_content.json";
import DecisionModal from "../ui/contentDecision";
import { useGameStore, calendarInterval } from "@/store/gameStore";
import { GameContentItem } from "../cli-game/dataTypes";

export default function NewsWindow({ era }: { era: string }) {
  const currentYear = useGameStore().currentYear;
  const [currentContentList, setCurrentContentList] = useState<
    GameContentItem[]
  >([]);
  const { decisionStatusList, markDecisionAsMade } = useGameStore();
  const isPending = (id?: string): boolean => {
    if (!id) return false;
    const d = decisionStatusList.find((d) => d.id === id);
    return d ? !d.hasDecided : false;
  };

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
        <h2 className="open-source-daily">Open Source Daily</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            {item.news?.map((newsObj, idx) => (
              <div key={idx}>
                {newsObj.headlineURL ? (
                  <h3 className="news-headline"><a href={newsObj.headlineURL} target="_blank">{newsObj.headline}</a></h3>
                ) : (
                  <h3 className="news-headline">{newsObj.headline}</h3>
                )}
                <p className="news-year">{item.year}</p>
                {/* {newsObj.featureImgURL?} */}
                <p className="news-summary">{newsObj.summary}</p>
                {newsObj.decisionTrigger &&
                  isPending(newsObj.decisionTrigger) && (
                    <button
                      onClick={() => {
                        setCurrentTriggerId(newsObj.decisionTrigger!);
                        setShowDecision(true);
                      }}
                    >
                      Pending Decision
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
              if (currentTriggerId) markDecisionAsMade(currentTriggerId);
              setCurrentTriggerId(null);
            }}
          />
        )}
      </div>
    </WinBox>
  );
}
