import { create } from "zustand";

export interface ContentDecision {
  id?: string;
  title: string;
  context: string;
  ["choice-end"]: string;
  ["choice-success"]: string;
  ["choice-end-title"]: string;
  ["choice-end-outcome"]: string;
  ["choice-success-title"]: string;
  ["choice-success-outcome"]: string;
  ["decision_id"]: string;
}

interface ContentDecisionStore {
  contentDecision: ContentDecision;               // 给 modal 用
  contentDecisionList: ContentDecision[];         // 给 PreInternet.tsx 用
  setContentDecision: (d: ContentDecision) => void;
  setContentDecisionList: (list: ContentDecision[]) => void;
}

const emptyDecision: ContentDecision = {
  title: "",
  context: "",
  ["choice-end"]: "",
  ["choice-success"]: "",
  ["choice-end-title"]: "",
  ["choice-end-outcome"]: "",
  ["choice-success-title"]: "",
  ["choice-success-outcome"]: "",
  ["decision_id"]: "",
};

export const useContentDecisionStore = create<ContentDecisionStore>((set) => ({
  contentDecision: emptyDecision,
  contentDecisionList: [],
  setContentDecision: (d) => set({ contentDecision: d }),
  setContentDecisionList: (list) => set({ contentDecisionList: list }),
}));
