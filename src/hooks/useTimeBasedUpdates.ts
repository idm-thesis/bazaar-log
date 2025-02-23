"use client";
import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import eraTimeline from "@/data/eras.json";
import { useDecisionSystem } from "./useDecisionSystem";

export function useTimeBasedUpdates() {
  const {
    personal_influence,
    era,
    setEra,
    decisions,
    setDecisions,
    setInformationTransmissionSpeed,
  } = useGameStore();
  const { addCollaborator, removeDecision } = useDecisionSystem();

  useEffect(() => {
    const informationTransmissionSpeedTimeline = [1, 10, 30, 60, 100];
    let eraIndex = eraTimeline.indexOf(era);
    if (eraIndex === -1 || eraIndex >= eraTimeline.length - 1) return;
    const eraDurations = [60000, 60000, 60000, 60000];
    const interval = setInterval(() => {
      eraIndex++;
      if (eraIndex < eraTimeline.length) {
        setEra(eraTimeline[eraIndex]);
        setInformationTransmissionSpeed(
          informationTransmissionSpeedTimeline[eraIndex]
        );
      }
    }, eraDurations[Math.min(eraIndex, eraDurations.length - 1)]);

    return () => clearInterval(interval);
  }, [era, setEra, setInformationTransmissionSpeed]);

  // ✅ UseEffect to randomly add decisions every 10 seconds
  useEffect(() => {
    const eraIdx = eraTimeline.indexOf(era);

    // ✅ Base decisions (moved outside `useEffect`)
    const baseDecisions = [
      {
        id: "add_collaborator",
        text: "A developer kindly asks if you are open to collaboration.",
        choices: [
          { label: "Yes, let's collaborate!", effect: () => addCollaborator() },
          {
            label: "No, content with the status quo.",
            effect: () => removeDecision("add_collaborator"),
          },
        ],
      },
    ];

    if (personal_influence > 20 && eraIdx > 0) {
      const interval = setInterval(() => {
        // ✅ Check if "add_collaborator" is already in decisions
        if (!decisions.some((decision) => decision.id === "add_collaborator")) {
          if (Math.random() < 0.8) {
            // ✅ 80% probability
            const newDecision = baseDecisions.find(
              (decision) => decision.id === "add_collaborator"
            );
            if (newDecision) {
              setDecisions([...decisions, newDecision]); // ✅ Add new decision
            }
          }
        }
      }, 5000); // ✅ Run every 5 seconds

      return () => clearInterval(interval); // ✅ Cleanup interval on dependency change
    }
  }, [personal_influence, era, setDecisions, addCollaborator, removeDecision, decisions]);

  return {era};
}
