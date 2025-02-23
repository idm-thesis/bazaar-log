"use client";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";
import eras from "@/data/eras.json";
import { useDecisionSystem } from "./useDecisionSystem";
import baseDecisions from "@/data/baseDecisions.json";
import rolesList from "@/data/roles.json";

export function useTimeBasedUpdates() {
  const {
    personal_influence,
    era,
    setEra,
    decisions,
    setDecisions,
    setInformationTransmissionSpeed,
    role,
  } = useGameStore();
  const { addCollaborator, removeDecision } = useDecisionSystem();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const personalInfluenceRef = useRef(personal_influence);
  // Track personal_influence separately to avoid unnecessary effect re-runs
  useEffect(() => {
    personalInfluenceRef.current = personal_influence;
  }, [personal_influence]);

  // Update era based on time passed
  useEffect(() => {
    let eraIndex = eras.findIndex((e) => e.era === era);
    if (eraIndex === -1 || eraIndex >= eras.length - 1) return;
    const interval = setInterval(() => {
      eraIndex++;
      if (eraIndex < eras.length) {
        const nextEra = eras[eraIndex];
        setEra(nextEra.era);
        setInformationTransmissionSpeed(nextEra.info_speed);
      }
    }, eras[eraIndex].eraDuration);

    return () => clearInterval(interval);
  }, [era, setEra, setInformationTransmissionSpeed]);

  // Randomly add collaboration decision every 5 seconds
  useEffect(() => {
    const eraObj = eras.find((e) => e.era === era);
    const eraIdx = eraObj ? eras.indexOf(eraObj) : -1;

    if (personalInfluenceRef.current > 20 && eraIdx > 0 && rolesList.indexOf(role) < 3) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (!decisions.some((decision) => decision.id === "addCollaborator")) {
            if (Math.random() < 0.8) {
              // 80% probability
              const newDecision = baseDecisions.find(
                (decision) => decision.id === "addCollaborator"
              );
              if (newDecision) {
                // Map effect strings to actual functions
                const mappedChoices = newDecision.choices.map((choice) => ({
                  ...choice,
                  effect: () => {
                    if (choice.effect === "addCollaborator") {
                      addCollaborator();
                    } else if (choice.effect.startsWith("removeDecision_")) {
                      const decisionId = choice.effect.replace(
                        "removeDecision_",
                        ""
                      );
                      removeDecision(decisionId);
                    }
                  },
                }));
  
                setDecisions([
                  ...decisions,
                  { ...newDecision, choices: mappedChoices },
                ]);
              }
            }
          }
        }, 5000);
      } 
      else {
        // If the condition is no longer met, clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      }
        

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [
    era,
    setDecisions,
    addCollaborator,
    removeDecision,
    decisions,
    role,
  ]);

  return { era };
}
