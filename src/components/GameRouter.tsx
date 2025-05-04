"use client";
import { useGameStore } from "@/store/gameStore";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import rawContentDecisions from "@/data/contentDecisions.json"; // adjust path
import gameContent from "@/data/Bazaar_log_game_content.json";
import { LANItem, NewsItem } from "./cli-game/dataTypes";

const PreInternet = dynamic(() => import("@/components/PreInternet"), {
  ssr: false,
});
const Web1990 = dynamic(() => import("@/components/Web1990"), { ssr: false });
const BlueScreen = dynamic(() => import("@/components/BlueScreen"), {
  ssr: false,
});
const Web2000 = dynamic(() => import("@/components/Web2000"), { ssr: false });
const Web2010 = dynamic(() => import("@/components/Web2010"), { ssr: false });
const Web2020 = dynamic(() => import("@/components/Web2020"), { ssr: false });
const Future = dynamic(() => import("@/components/Future"), { ssr: false });

export default function GameRouter() {
  useEffect(() => {
    console.log("Mounted for the first time.");
  }, []);

  function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value < max;
  }

  const {
    currentYear,
    gameStage,
    setGameStage,
    gamePhase,
    blueScreenCompleted,
    setDecisionStatusList,
    hasInitializedDecisionStatusList,
    setHasInitializedDecisionStatusList,
  } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // prevent mismatch by rendering only after mount
  }, []);

  // Set Game Stage
  useEffect(() => {
    if (["boot", "restart"].includes(gamePhase)) return;
    if (isInRange(currentYear, 1970, 1990) && gameStage !== "preInternet") {
      setGameStage("preInternet");
    } else if (isInRange(currentYear, 1990, 2000) && gameStage !== "web1990") {
      
      setGameStage("web1990");
    } else if (
      currentYear === 2000 &&
      gameStage !== "blueScreen" &&
      !blueScreenCompleted
    ) {
      setGameStage("blueScreen");
    } else if (
      isInRange(currentYear, 2000, 2010) &&
      gameStage !== "web2000" &&
      blueScreenCompleted
    ) {
      setGameStage("web2000");
    } else if (isInRange(currentYear, 2010, 2020) && gameStage !== "web2010") {
      setGameStage("web2010");
    } else if (
      isInRange(currentYear, 2020, 2026) &&
      gameStage !== "web2020" &&
      gameStage !== "future"
    ) {
      setGameStage("web2020");
    }
    console.log(
      "[GameRouter] currentYear:",
      currentYear,
      "→ gameStage:",
      gameStage
    );
  }, [currentYear, gameStage, gamePhase]);

  function findYearByDecisionId(id: string): number {
    for (const item of gameContent) {
      if (item.news?.some((n: NewsItem) => n.decisionTrigger === id))
        return item.year;
      if (item.lan_posts?.some((l: LANItem) => l.decisionTrigger === id))
        return item.year;
    }
    return -1; // or throw an error
  }
  useEffect(() => {
    if (hasInitializedDecisionStatusList) return;
  
    const list = rawContentDecisions.map((d) => ({
      id: d.id,
      year: findYearByDecisionId(d.id),
      hasDecided: false,
    }));
  
    setDecisionStatusList(list);
    setHasInitializedDecisionStatusList(true);
    
    console.log("[Decision Init]", list);
  }, [hasInitializedDecisionStatusList]);

  
  if (!mounted) return null;
  // Testing
  // return (
  //   <div className="min-h-screen" id="future">
  //     <Future />
  //   </div>
  // );
  return (
    <div className="min-h-screen" id="bsod">
      <BlueScreen />
    </div>
  );
  
  switch (gameStage) {
    case "preInternet":
      return (
        <div
          id="monitor"
          className="min-h-screen"
          style={{ background: "#000" }}
        >
          <PreInternet />
        </div>
      );
    case "web1990":
      return (
        <div className="min-h-screen" id="web1990">
          <Web1990 />
        </div>
      );
    case "blueScreen":
      return (
        <div className="min-h-screen" id="bsod">
          <BlueScreen />
        </div>
      );
    case "web2000":
      return (
        <div className="min-h-screen" id="web2000">
          <Web2000 />
        </div>
      );
    case "web2010":
      return (
        <div className="min-h-screen" id="web2010">
          <Web2010 />
        </div>
      );
    case "web2020":
      return (
        <div className="min-h-screen" id="web2020">
          <Web2020 />
        </div>
      );
    case "future":
      return (
        <div className="min-h-screen" id="future">
          <Future />
        </div>
      );
    default:
      return (
        <div
          id="monitor"
          className="min-h-screen"
          style={{ background: "#000" }}
        >
          <PreInternet />
        </div>
      );
  }
}
