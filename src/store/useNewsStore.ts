import {create} from "zustand";

export interface News {
    year: number;
    headline: string;
    headlineURL?: string;
    featureImgURL?: string;
    summary?: string;
    decisionTrigger?: string; // optional trigger for a game decision
  }

interface NewsStore {
    news: News[];
    setNews: (news: News[]) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
    news: [],
    setNews: (news) => set({news}),
}));