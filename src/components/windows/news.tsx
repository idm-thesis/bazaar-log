"use client";
import { useEffect, useState } from "react";
import WinBox from "@/components/windows/WinBox";
import DecisionModal from "../ui/contentDecision";
import { useGameStore, calendarInterval } from "@/store/gameStore";
import { supabase } from "@/lib/supabaseClient";
import { useNewsStore } from "@/store/useNewsStore";
// import Image from "next/image";

export default function NewsWindow({ era }: { era: string }) {
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
  const { news, setNews } = useNewsStore();
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .gt("year", currentYear - calendarInterval)
        .lte("year", currentYear)
        .order("year", { ascending: true });
      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setNews(data);
      }
    };
    fetchNews();
  }, [setNews, currentYear]);

  const [showDecision, setShowDecision] = useState(false);
  const [currentTriggerId, setCurrentTriggerId] = useState<string | null>(null);

  return (
    <WinBox id="news" title="News" width="600px" height="400px" era={era}>
      <div className="window-body">
        <h2 className="open-source-daily">Open Source Daily</h2>
        {news.map((newsObj, index) => (
          <div key={index}>
            {newsObj.headlineURL ? (
              <h3 className="news-headline">
                <a href={newsObj.headlineURL} target="_blank">
                  {newsObj.headline}
                </a>
              </h3>
            ) : (
              <h3 className="news-headline">{newsObj.headline}</h3>
            )}
            <p className="news-year">{newsObj.year}</p>
            {/* Feature Image */}
            {/* {newsObj.featureImgURL ? (
              <Image
                src={newsObj.featureImgURL}
                alt=""
                width={400}
                height={400}
              />
            ) : null} */}
            {newsObj.summary ? (
              <p className="news-summary">{newsObj.summary}</p>
            ) : null}
            {newsObj.decisionTrigger && isPending(newsObj.decisionTrigger) && (
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
