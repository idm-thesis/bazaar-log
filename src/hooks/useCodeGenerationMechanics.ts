// What functions to include: player-action-based update functions
"use client";
import { useCallback, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

export function useCodeGenerationMechanics() { 
  // Core mechanics: code writing
  const { 
    next_tool_numerator, 
    next_tool_denominator, 
    number_of_tools, 
    tool_productivity, 
    setNextToolNumerator, 
    setNumberOfTools
  } = useGameStore();

  // Update number of tools and lines of code
  const writeCode = useCallback((lines = 1) => {
    const newNumerator = next_tool_numerator + lines;
    if (newNumerator >= next_tool_denominator) {
      setNumberOfTools(number_of_tools + Math.floor(newNumerator/next_tool_denominator));
      setNextToolNumerator(next_tool_denominator);
      // wait for 0.2 second, visually showing that a tool is created
      setTimeout(() => {
        setNextToolNumerator(0);
      }, 100);  
      setTimeout(() => {
        setNextToolNumerator(newNumerator % next_tool_denominator);
      }, 300);
    } else {
      setNextToolNumerator(newNumerator);
    }
  }, [next_tool_numerator, next_tool_denominator, number_of_tools, setNextToolNumerator, setNumberOfTools]);
  
  
  useEffect(() => {
    if (tool_productivity > 0) {
      const interval = setInterval(() => {
        writeCode(tool_productivity); // Automate code generation
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [
    tool_productivity,
    next_tool_numerator,
    next_tool_denominator,
    writeCode,
  ]);

  return {writeCode};
}