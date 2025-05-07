import {create} from "zustand";

export interface LAN {
    year: number;
    title: string;
    author: string;
    content: string; // post content
    decisionTrigger?: string;
  }

interface LANStore {
    lan: LAN[];
    setLAN: (news: LAN[]) => void;
}

export const useLANStore = create<LANStore>((set) => ({
    lan: [],
    setLAN: (lan) => set({lan}),
}));