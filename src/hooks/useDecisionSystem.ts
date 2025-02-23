"use client";
import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
// import eraTimeline from "@/data/eras.json";

export function useDecisionSystem() {
  const {
    number_of_collaborators,
    setNumberOfCollaborators,
    decisions,
    setDecisions,
  } = useGameStore();

  // ✅ Remove decision by ID
  const removeDecision = useCallback((decisionId: string) => {
    setDecisions(decisions.filter((decision) => decision.id !== decisionId));
  }, [setDecisions, decisions]);

  // ✅ Add collaborator and remove the decision
  const addCollaborator = useCallback(() => {
    setNumberOfCollaborators(number_of_collaborators + 1);
    removeDecision("add_collaborator");
  }, [setNumberOfCollaborators, removeDecision, number_of_collaborators]);

  return { decisions, addCollaborator, removeDecision };
}
