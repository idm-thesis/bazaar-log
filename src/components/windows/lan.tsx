"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/windows/WinBox";
import DecisionModal from "../ui/contentDecision";
import { useGameStore, calendarInterval } from "@/store/gameStore";
import { useLANStore } from "@/store/useLANStore";
import { supabase } from "@/lib/supabaseClient";

export default function LANWindow({ era }: { era: string }) {
  const currentYear = useGameStore().currentYear;
  // const [currentContentList, setCurrentContentList] = useState<
  //   GameContentItem[]
  // >([]);
  const { decisionStatusList, markDecisionAsMade } = useGameStore();
  const isPending = (id?: string): boolean => {
    if (!id) return false;
    const d = decisionStatusList.find((d) => d.id === id);
    return d ? !d.hasDecided : false;
  };

  const { lan, setLAN } = useLANStore();
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("lan_posts")
        .select("*")
        .gt("year", currentYear - calendarInterval)
        .lte("year", currentYear)
        .order("year", { ascending: true });
      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setLAN(data);
      }
    };
    fetchNews();
  }, [setLAN, currentYear]);

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
        <h2 className="text-center my-4 local-area-network">Local Area Network Communication Channel</h2>
        {lan.map((lanObj, index) => (
          <div key={index} className="my-8">
            <h4>{lanObj.title}</h4>
            <p className="lan-author">Author: {lanObj.author}</p>
            <p className="lan-comment">{lanObj.content}</p>
            {lanObj.decisionTrigger && isPending(lanObj.decisionTrigger) && (
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
