import { create } from "zustand";

export interface NotebookEntry {
  year: number;
  note: string;
}

interface NotebookStore {
  notebook: NotebookEntry[];
  setNotebook: (entries: NotebookEntry[]) => void;
}

export const useNotebookStore = create<NotebookStore>((set) => ({
  notebook: [],
  setNotebook: (entries) => set({ notebook: entries }),
}));
