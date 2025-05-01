"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/windows/WinBox";
// import { calendarInterval } from "@/store/useCalendarStore";
import gameContent from "@/data/Bazaar_log_game_content.json";
import DecisionModal from "../ui/contentDecision";
import { useGameStore, calendarInterval } from "@/store/gameStore";
import { GameContentItem } from "../cli-game/dataTypes";

export default function LANWindow({ era }: { era: string }) {
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
    <WinBox
      id="lan"
      title="Local Area Network"
      width="600px"
      height="400px"
      era={era}
    >
      <div className="window-body">
        <h2>Local Area Network</h2>
        {currentContentList.map((item, index) => (
          <div key={index}>
            {item.lan_posts && item.lan_posts.length > 0 && (
              <h3>{item.year}</h3>
            )}
            {item.lan_posts?.map((lanObj, idx) => (
              <div key={idx}>
                <h4>{lanObj.title}</h4>
                <p>{lanObj.author}</p>
                <p>{lanObj.content}</p>
                {lanObj.decisionTrigger &&
                  isPending(lanObj.decisionTrigger) && (
                    <button
                      onClick={() => {
                        setCurrentTriggerId(lanObj.decisionTrigger!);
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
