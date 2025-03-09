import {create} from "zustand";

interface CalendarState {
    currentYear: number;
    nextYear: () => void;
    prevYear: () => void;
    setYear: (year: number) => void;
}

const startingYear = 1990; // Starting year in the game, 

export const useCalendarStore = create<CalendarState>((set) => ({
    currentYear: startingYear,
    nextYear: () => set((state) => ({currentYear: state.currentYear + 1})),
    prevYear: () => set((state) => ({currentYear: state.currentYear - 1})),
    setYear: (year) => set({currentYear: year}),
}));