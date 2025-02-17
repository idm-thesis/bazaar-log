"use client";
import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";

export function useTimeBasedUpdates() {
  const { era, setEra, setInformationTransmissionSpeed } = useGameStore();

  useEffect(() => {
    const eraTimeline = [
      "Pre-Internet",
      "Web 1.0",
      "Web 2.0",
      "Web 3.0",
      "Artificial Intelligence",
    ];
    const informationTransmissionSpeedTimeline = [
      1, 10, 30, 60, 100
    ];
    let eraIndex = eraTimeline.indexOf(era);
    if (eraIndex === -1 || eraIndex >= eraTimeline.length - 1) return;
    const eraDurations = [240000, 180000, 120000, 60000];
    const interval = setInterval(() => {
      eraIndex++;
      if (eraIndex < eraTimeline.length) {
        setEra(eraTimeline[eraIndex]);
        setInformationTransmissionSpeed(informationTransmissionSpeedTimeline[eraIndex]);
      }
    }, eraDurations[eraIndex]);

    return () => clearInterval(interval); 
  }, [era, setEra, setInformationTransmissionSpeed]);

  return { era };
}
