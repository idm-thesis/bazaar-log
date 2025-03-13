import {create} from "zustand";

interface CalendarState {
    currentYear: number;
    nextYear: () => void;
    // prevYear: () => void;
    setYear: (year: number) => void;
}

export const startingYear = 1970; // Starting year in the game,
export const minYear = 1970;
export const maxYear = 2025;
export const calendarInterval = 5;

export const useCalendarStore = create<CalendarState>((set) => ({
    currentYear: startingYear,
    nextYear: () => 
        set((state) => ({currentYear: state.currentYear < maxYear ? state.currentYear + calendarInterval : state.currentYear,})),
    // prevYear: () => set((state) => ({currentYear: 
    //     state.currentYear > minYear ? state.currentYear - 1 : state.currentYear
    // })),
    setYear: (year) => 
        set(() => ({
            currentYear: year >= minYear && year <= maxYear ? year: startingYear,
        })),
}));