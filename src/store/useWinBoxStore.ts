import { create } from "zustand";

type WinBoxRef = {
  id: string;
  close: () => void;
};

interface WinBoxState {
  boxes: WinBoxRef[];
  registerBox: (box: WinBoxRef) => void;
  clearAllBoxes: () => void;
}

export const useWinBoxStore = create<WinBoxState>((set, get) => ({
  boxes: [],
  registerBox: (box) => set((state) => ({
    boxes: [...state.boxes, box]
  })),
  clearAllBoxes: () => {
    get().boxes.forEach((box) => box.close());
    set({ boxes: [] });
  }
}));
