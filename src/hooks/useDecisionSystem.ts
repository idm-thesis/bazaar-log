"use client";
import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import roles from "@/data/roles.json";

export function useDecisionSystem() {
  const {
    number_of_collaborators,
    setNumberOfCollaborators,
    decisions,
    setDecisions,
    setRole,
    number_of_organizations,
    setNumberOfOrganizations,
  } = useGameStore();

  // Remove decision by ID
  const removeDecision = useCallback((decisionId: string) => {
    setDecisions(decisions.filter((decision) => decision.id !== decisionId));
  }, [setDecisions, decisions]);

  // Add collaborator and remove the decision
  const addCollaborator = useCallback(() => {
    setNumberOfCollaborators(number_of_collaborators + 1);
    removeDecision("addCollaborator");
  }, [setNumberOfCollaborators, removeDecision, number_of_collaborators]);

  // Form an organization
  const formOrganization = useCallback(() => {
    // Update role from "Open-source Collaborator" to "Open-source Organization Founder", based on number_of_collaborators
    setRole(roles[3]);
    setNumberOfOrganizations(number_of_organizations + 1);
    removeDecision("formOrganization");
  },[setRole, removeDecision, number_of_organizations, setNumberOfOrganizations]);

  return { decisions, addCollaborator, removeDecision, formOrganization };
}
