import { RefObject } from "react";

export const createTyping = (
  setTerminalLines: React.Dispatch<React.SetStateAction<string[]>>,
  textRef: RefObject<HTMLDivElement | null>,
  typingSpeed: number = 10,
  typingLineDelay: number = 200
) => {
  // Typing line animation
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const typeText = async (
  text: string,
  speed: number = typingSpeed
): Promise<void> => {
  return new Promise(async (resolve) => {
    // 先插入一行空白
    let currentLine = "";
    await new Promise((lineResolve) => {
      setTerminalLines((prevLines) => {
        lineResolve(null);
        return [...prevLines, ""];
      });
    });

    for (let i = 0; i < text.length; i++) {
      currentLine += text.charAt(i);
      setTerminalLines((prevLines) => {
        const newLines = [...prevLines];
        newLines[newLines.length - 1] = currentLine;
        return newLines;
      });

      if (textRef.current) {
        textRef.current.scrollTop = textRef.current.scrollHeight;
      }

      await sleep(speed);
    }

    resolve();
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
    lineDelay: number = typingLineDelay,
    append: boolean = true,
  ) => {
    if (!append) setTerminalLines([]);
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
