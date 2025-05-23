"use client";
import { create } from "zustand";
export type GamePhase = "loading" | "boot" | "tutorial" | "freeplay" | "restart";
export type GameStage =
  | "preInternet"
  | "web1990"
  | "blueScreen"
  | "web2000"
  | "web2010"
  | "web2020"
  | "future";
export type ContentDecisionStatus = {
  id: string;
  year: number;
  hasDecided: boolean;
};

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
  setShowNumberOfOrganizations: (visible: boolean) => void;
  number_of_organizations: number;
  setNumberOfOrganizations: (count: number) => void;

  // Decisions
  decisions: Decision[];
  setDecisions: (update: (prev: Decision[]) => Decision[]) => void;

  // Content-based Decisions
  contentDecisions: Record<string, string>;
  setContentDecisions: (id: string, value: string) => void;
  resetGame: () => void;
  contentDecisionPending: boolean;
  setContentDecisionPending: (value: boolean) => void;
  decisionStatusList: ContentDecisionStatus[];
  setDecisionStatusList: (update: ContentDecisionStatus[]) => void;
  markDecisionAsMade: (id: string) => void;
  hasInitializedDecisionStatusList: boolean;
  setHasInitializedDecisionStatusList: (val: boolean) => void;

  // Year
  currentYear: number;
  nextYear: () => void;
  setYear: (year: number) => void;
  calendarInterval: number;

  // CLI game phase
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;

  // Game stage
  gameStage: GameStage;
  setGameStage: (stage: GameStage) => void;
  blueScreenCompleted: boolean;
  setBlueScreenCompleted: (value: boolean) => void;
}

export const startingYear = 1970; // Starting year in the game,
export const minYear = 1970;
export const maxYear = 2025;
export const calendarInterval = 5;

const initialState = {
  // Personal Information
  name: "Macaroni",
  role: "Coding Enthusiast",
  show_personal_influence: false,
  personal_influence: 0,

  // Environment
  era: "Pre-Internet",
  information_transmission_speed: 1,

  show_number_of_users: false,
  number_of_users: 0,

  show_number_of_collaborators: false,
  number_of_collaborators: 0,

  show_number_of_contributors: false,
  number_of_contributors: 0,

  // Contribution
  show_next_tool: true,
  next_tool_numerator: 0,
  next_tool_denominator: 10,

  show_number_of_tools: true,
  number_of_tools: 0,

  show_value_generated: false,
  value_generated: 0,

  show_tool_productivity: false,
  tool_productivity: 0,

  show_value_generation_speed: false,
  value_generation_speed: 0,

  show_number_of_organizations: false,
  number_of_organizations: 0,

  // Decisions
  decisions: [],

  // Content-based Decisions
  contentDecisions: {},
  contentDecisionPending: false,
  decisionStatusList: [],
  hasInitializedDecisionStatusList: false,
  // Year
  currentYear: startingYear,
  calendarInterval: calendarInterval,

  gamePhase: "loading" as GamePhase,

  gameStage: "preInternet" as GameStage,

  blueScreenCompleted: false,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  // Personal Information
  setRole: (newRole: string) => set({ role: newRole }),
  setShowPersonalInfluence: (visible: boolean) =>
    set({ show_personal_influence: visible }),
  setPersonalInfluence: (count: number) => set({ personal_influence: count }),

  // Environment
  setEra: (newEra: string) => set({ era: newEra }),
  setInformationTransmissionSpeed: (count: number) =>
    set({ information_transmission_speed: count }),
  setShowNumberOfUsers: (visible: boolean) =>
    set({ show_number_of_users: visible }),
  setNumberOfUsers: (count: number) => set({ number_of_users: count }),
  setShowNumberOfCollaborators: (visible: boolean) =>
    set({ show_number_of_collaborators: visible }),
  setNumberOfCollaborators: (count: number) =>
    set({ number_of_collaborators: count }),

  setShowNumberOfContributors: (visible: boolean) =>
    set({ show_number_of_contributors: visible }),
  setNumberOfContributors: (count: number) =>
    set({ number_of_contributors: count }),

  // Contribution
  setShowNextTool: (visible: boolean) => set({ show_next_tool: visible }),
  setNextToolNumerator: (count: number) => set({ next_tool_numerator: count }),
  setNextToolDenominator: (count: number) =>
    set({ next_tool_denominator: count }),

  setShowNumberOfTools: (visible: boolean) =>
    set({ show_number_of_tools: visible }),
  setNumberOfTools: (count: number) => set({ number_of_tools: count }),

  setShowValueGenerated: (visible: boolean) =>
    set({ show_value_generated: visible }),
  setValueGenerated: (count: number) => set({ value_generated: count }),

  setShowToolProductivity: (visible: boolean) =>
    set({ show_tool_productivity: visible }),
  setToolProductivity: (count: number) => set({ tool_productivity: count }),

  setShowValueGenerationSpeed: (visible: boolean) =>
    set({ show_value_generation_speed: visible }),
  setValueGenerationSpeed: (count: number) =>
    set({ value_generation_speed: count }),

  setShowNumberOfOrganizations: (visible: boolean) =>
    set({ show_number_of_organizations: visible }),
  setNumberOfOrganizations: (count: number) =>
    set({ number_of_organizations: count }),

  // Decisions
  setDecisions: (update) =>
    set((state) => ({ decisions: update(state.decisions) })),

  // Content-based Decisions
  setContentDecisions: (id: string, value: string) =>
    set((state) => ({
      contentDecisions: { ...state.contentDecisions, [id]: value },
    })),

  setContentDecisionPending: (value: boolean) =>
    set({ contentDecisionPending: value }),
  setDecisionStatusList: (update) => set({ decisionStatusList: update }),

  markDecisionAsMade: (id) =>
    set((state) => ({
      decisionStatusList: state.decisionStatusList.map((d) =>
        d.id === id ? { ...d, hasDecided: true } : d
      ),
    })),
  setHasInitializedDecisionStatusList: (val) =>
    set({ hasInitializedDecisionStatusList: val }),

  // Year
  nextYear: () => {
    const state = get();
    const next = state.currentYear + state.calendarInterval;
    if (next > maxYear) {
      if (state.gameStage !== "future") {
        set({ gameStage: "future" });
      }
      return;
    }
    set({ currentYear: next });
  },

  setYear: (year) => {
    const newYear = year >= minYear && year <= maxYear ? year : startingYear;
    set({ currentYear: newYear });
  },

  setGamePhase: (phase) => set({ gamePhase: phase }),
  setGameStage: (stage) => set({ gameStage: stage }),
  setBlueScreenCompleted: (value) => set({ blueScreenCompleted: value }),
  // Reset function
  resetGame: () => set(() => ({ ...initialState })),
}));
