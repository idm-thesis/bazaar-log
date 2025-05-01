import { ContentDecisionStatus } from "@/store/gameStore";

export function hasPendingDecisions(
    currentYear: number,
    decisions: ContentDecisionStatus[],
    calendarInterval: number
  ): boolean {
    const startYear = currentYear - (calendarInterval - 1);
    return decisions.some(
      (d) => d.year >= startYear && d.year <= currentYear && !d.hasDecided
    );
  }
  
