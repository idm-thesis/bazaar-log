"use client";
import { useEffect } from "react";

export function useCloseAllWinBoxes() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.WinBox) {
      const allBoxes = window.WinBox.getAll?.();
      if (allBoxes) {
        allBoxes.forEach((box: any) => box.close());
      }
    }
  }, []);
}
