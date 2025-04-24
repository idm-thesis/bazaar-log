import { RefObject } from "react";

export const createTyping = (
  setTerminalLines: React.Dispatch<React.SetStateAction<string[]>>,
  textRef: RefObject<HTMLDivElement | null>,
  typingSpeed: number = 10,
  typingLineDelay: number = 200
) => {
  // Typing line animation
  const typeText = async (
    text: string,
    speed: number = typingSpeed
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      let index = 0;

      // Step 1: Add the new line and wait for it to be committed
      await new Promise((lineResolve) => {
        setTerminalLines((prevLines) => {
          lineResolve(null);
          return [...prevLines, text.charAt(0)];
        });
      });

      // Step 2: Start typing the characters
      const type = () => {
        setTerminalLines((prevLines) => {
          const newLines = [...prevLines];
          const currentLineIndex = newLines.length - 1;

          newLines[currentLineIndex] += text.charAt(index);
          return newLines;
        });

        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }

        index++;

        if (index < text.length) {
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      // Start typing
      type();
    });
  };

  const typeLine = async (line: string, delay: number = 500): Promise<void> => {
    return new Promise((resolve) => {
      setTerminalLines((prevLines) => [...prevLines, line]);
      setTimeout(() => resolve(), delay);
    });
  };

  const typeLinesWithCharacters = async (
    lines: string[],
    speed: number = typingSpeed,
    lineDelay: number = typingLineDelay
  ) => {
    for (const line of lines) {
      await typeText(line, speed);
      await new Promise((resolve) => setTimeout(resolve, lineDelay));
    }
  };

  return {
    typeText,
    typeLine,
    typeLinesWithCharacters,
  }
};
