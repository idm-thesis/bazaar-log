"use client";
import { create } from "zustand";

type Decision = {
  id: string;
  text: string;
  choices: { label: string; effect: () => void }[];
};


interface GameState {
  // Personal Information
  name: string;
  role: string;
  setRole: (newRole: string) => void;
  show_personal_influence: boolean;
  setShowPersonalInfluence: (visible: boolean) => void;
  personal_influence: number;
  setPersonalInfluence: (count: number) => void;

  // Environment
  era: string;
  setEra: (newEra: string) => void;
  information_transmission_speed: number;
  setInformationTransmissionSpeed: (count: number) => void;

  show_number_of_users: boolean;
  number_of_users: number;
  setShowNumberOfUsers: (visible: boolean) => void;
  setNumberOfUsers: (count: number) => void;

  show_number_of_collaborators: boolean;
  number_of_collaborators: number;
  setShowNumberOfCollaborators: (visible: boolean) => void;
  setNumberOfCollaborators: (count: number) => void;

  show_number_of_contributors: boolean;
  number_of_contributors: number;
  setShowNumberOfContributors: (visible: boolean) => void;
  setNumberOfContributors: (count: number) => void;

  // Contribution
  show_next_tool: boolean;
  setShowNextTool: (visible: boolean) => void;
  next_tool_numerator: number;
  setNextToolNumerator: (count: number) => void;
  next_tool_denominator: number;
  setNextToolDenominator: (count: number) => void;

  show_number_of_tools: boolean;
  setShowNumberOfTools: (visible: boolean) => void;
  number_of_tools: number;
  setNumberOfTools: (count: number) => void;

  show_value_generated: boolean;
  setShowValueGenerated: (visible: boolean) => void;
  value_generated: number;
  setValueGenerated: (count: number) => void;

  show_tool_productivity: boolean;
  setShowToolProductivity: (visible: boolean) => void;
  tool_productivity: number;
  setToolProductivity: (count: number) => void;

  show_value_generation_speed: boolean;
  setShowValueGenerationSpeed: (visible: boolean) => void;
  value_generation_speed: number;
  setValueGenerationSpeed: (count: number) => void;

  show_number_of_organizations: boolean;
  setShowNumberOfOrganization: (visible: boolean) => void;
  number_of_organizations: number;
  setNumberOfOrganization: (count: number) => void;

  // Decisions
  decisions: Decision[],
  setDecisions: (newDecisions: Decision[]) => void,
}

export const useGameStore = create<GameState>((set) => ({
  // Personal Information
  name: "Macaroni",
  role: "Coding Enthusiast",
  setRole: (newRole: string) => set({role: newRole}),
  show_personal_influence: false,
  personal_influence: 0,
  setShowPersonalInfluence: (visible: boolean) => set({ show_personal_influence: visible }),
  setPersonalInfluence: (count: number) => set({ personal_influence: count }),

  // Environment
  era: "Pre-Internet",
  setEra: (newEra: string) => set({ era: newEra }),
  information_transmission_speed: 1,
  setInformationTransmissionSpeed: (count: number) => set({ information_transmission_speed: count }),

  show_number_of_users: false,
  setShowNumberOfUsers: (visible: boolean) => set({ show_number_of_users: visible }),
  number_of_users: 0,
  setNumberOfUsers: (count: number) => set({ number_of_users: count }),

  show_number_of_collaborators: false,
  setShowNumberOfCollaborators: (visible: boolean) => set({ show_number_of_collaborators: visible }),
  number_of_collaborators: 0,
  setNumberOfCollaborators: (count: number) => set({ number_of_collaborators: count }),

  show_number_of_contributors: false,
  setShowNumberOfContributors: (visible: boolean) => set({ show_number_of_contributors: visible }),
  number_of_contributors: 0,
  setNumberOfContributors: (count: number) => set({ number_of_contributors: count }),

  // Contribution
  show_next_tool: true,
  setShowNextTool: (visible: boolean) => set({ show_next_tool: visible }),
  next_tool_numerator: 0,
  setNextToolNumerator: (count: number) => set({ next_tool_numerator: count }),
  next_tool_denominator: 10,
  setNextToolDenominator: (count: number) => set({ next_tool_denominator: count }),

  show_number_of_tools: true,
  setShowNumberOfTools: (visible: boolean) => set({ show_number_of_tools: visible }),
  number_of_tools: 0,
  setNumberOfTools: (count: number) => set({ number_of_tools: count }),

  show_value_generated: false,
  setShowValueGenerated: (visible: boolean) => set({ show_value_generated: visible }),
  value_generated: 0,
  setValueGenerated: (count: number) => set({ value_generated: count }),

  show_tool_productivity: false,
  setShowToolProductivity: (visible: boolean) => set({ show_tool_productivity: visible }),
  tool_productivity: 0,
  setToolProductivity: (count: number) => set({ tool_productivity: count }),

  show_value_generation_speed: false,
  setShowValueGenerationSpeed: (visible: boolean) => set({ show_value_generation_speed: visible }),
  value_generation_speed: 0,
  setValueGenerationSpeed: (count: number) => set({ value_generation_speed: count }),

  show_number_of_organizations: false,
  setShowNumberOfOrganization: (visible: boolean) => set({ show_number_of_organizations: visible }),
  number_of_organizations: 0,
  setNumberOfOrganization: (count: number) => set({ number_of_organizations: count }),

  // Decisions
  decisions: [],
  setDecisions: (newDecisions) => set({ decisions: newDecisions }),
}));
