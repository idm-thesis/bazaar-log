"use client";
import { useEffect, useRef, useState } from "react";
import { useCalendarStore, minYear, maxYear } from "@/store/useCalendarStore";

export default function PreInternet() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingSpeed = 30;
  const typingLineDelay = 200;

  const { currentYear, prevYear, nextYear } = useCalendarStore();
  const [bootYear] = useState(currentYear);
  const [calendarMode, setCalendarMode] = useState(false);

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

  const handleUserInput = async () => {
    const input = userInput.trim().toLowerCase();
    if (isTyping) return;
    setUserInput("");
    setInputDisplay("");
    setIsTyping(true);
    // await typeLine(`> ${input}`);

    // Calendar navigation logic
    if (calendarMode) {
      await typeLine(`${input}`);
      if (input === "p") {
        if (currentYear <= minYear) {
          setTerminalLines((prev) => [
            ...prev,
            `[Calendar]`,
            `- Year: ${currentYear}`,
            `Already at the minimum year (${minYear})`,
            "Go to next year: type 'N' + Enter",
            "Or, press Enter to exit Calendar",
          ]);
        } else {
          prevYear();
          setTimeout(() => {
            const updatedYear = useCalendarStore.getState().currentYear;
            updateCalendarDisplay(updatedYear);
          }, 0);
        }
      } else if (input === "n") {
        if (currentYear >= maxYear) {
          setTerminalLines((prev) => [
            ...prev,
            `[Calendar]`,
            `- Year: ${currentYear}`,
            `Already at the maximum year (${maxYear})`,
            "Go to previous year: type 'P' + Enter",
            "Or, press Enter to exit Calendar",
          ]);
        } else {
          nextYear();
          setTimeout(() => {
            const updatedYear = useCalendarStore.getState().currentYear;
            updateCalendarDisplay(updatedYear);
          }, 0);
        }
      } else if (input === "") {
        exitCalendarMode();
      } else {
        setTerminalLines((prev) => [
          ...prev,
          `[Calendar] Invalid input: "${input}"`,
          "Press 'P' for previous year, 'N' for next year, or Enter to exit.",
        ]);
      }

      // Reset input after handling command
      setUserInput("");
      setInputDisplay("");
      setIsTyping(false);
      return; // Don't run normal command handling
    } else {
      await typeLine(`> ${input}`);
    }

    let responseLines: string[] = [];

    if (input === "help") {
      responseLines = [
        "",
        "GAME NAME",
        "    Bazaar.log",
        "",
        "SHORT DESCRIPTION",
        "    Short description of game Bazaar.log.",
        "",
        "LONG DESCRIPTION",
        "    Long description of game Bazaar.log.",
        "",
      ];
    } else if (input === "list") {
      responseLines = [
        "",
        "AVAILABLE ACTIONS",
        "    news        View the latest news articles",
        "    dashboard   Display work progress dashboard",
        "    notebook    View TODO list",
        "    calendar    View the yearly calendar",
        "    lan         Check Local Area Network messages",
        "",
      ];
    } else if (input === "calendar") {
      setCalendarMode(true);
      responseLines = [
        "[Loading...]",
        "[Calendar]",
        `- Year: ${currentYear}`,
        "Go to previous year: press 'P'",
        "Go to next year: press 'N'",
        "Or, press Enter to exit Calendar: ",
      ];
    } else if (input === "notebook") {
      responseLines = ["Notebook: TODO - This section is under construction."];
    } else if (input === "dashboard") {
      responseLines = ["Dashboard: TODO - Dashboard stats will appear here."];
    } else if (input === "news") {
      responseLines = ["News: TODO - Latest articles will be displayed here."];
    } else if (input === "lan") {
      responseLines = ["LAN: TODO - No messages found on the network."];
    } else {
      responseLines = [
        `Unknown command: "${input}"`,
        `Type 'help' to get detailed information.`,
      ];
    }

    await typeLinesWithCharacters(responseLines, typingSpeed);

    setIsTyping(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUserInput();
    }
  };

  const [inputDisplay, setInputDisplay] = useState("");

  const exitCalendarMode = () => {
    setCalendarMode(false);
    setTerminalLines((prev) => [...prev, "[Exiting Calendar]"]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperInput = e.target.value.toUpperCase();
    setUserInput(upperInput);
    setInputDisplay(upperInput);
  };

  // Initial welcome message when the component mounts
  const bootedRef = useRef(false);
  useEffect(() => {
    if (bootedRef.current) return; // Already booted, skip
    bootedRef.current = true; // Mark as booted
    const bootSequence = async () => {
      setIsTyping(true);
      const bootLines = [
        "[Booting Bazaar.log v0.1]",
        "[Initializing Memory Check... OK]",
        "[Loading Modules... OK]",
        "[Establishing Network Connection... OK]",
        "",
        "Welcome to the Bazaar.log. We are in " + bootYear + " now.",
        "-----------------------------------------------------",
        "Available Commands:",
        "- news      : View the latest news articles",
        "- dashboard : Display work progress dashboard",
        "- notebook  : View TODO list",
        "- calendar  : View the yearly calendar",
        "- lan       : Access LAN communications",
        "- list      : List all available commands",
        "- help      : Get detailed information about Bazaar.log",
        "",
        "Type 'list' to see all commands or 'help' for game details.",
        "-----------------------------------------------------",
        "",
      ];

      await typeLinesWithCharacters(bootLines, typingSpeed);

      setIsTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    bootSequence();
  }, []);

  // Function: auto-scroll to bottom of text
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Function: update calendar year
  const updateCalendarDisplay = (year: number) => {
    const lines = [
      "[Calendar]",
      `- Year: ${year}`,
      "Go to previous year: press 'P'",
      "Go to next year: press 'N'",
      "Or, press Enter to exit Calendar",
    ];

    setTerminalLines((prev) => [...prev, ...lines]);
  };

  return (
    <div
      id="monitor"
      className="flex items-center justify-center w-screen h-screen"
    >
      <div
        id="bezel"
        className="relative w-[80vw] h-[60vh] border-[10px] border-transparent"
      >
        <div className="crt relative w-full h-full bg-transparent text-green-400 text-lg overflow-hidden">
          <div className="scanline pointer-events-none" />

          {/* Terminal content */}
          <div className="terminal w-full h-full flex flex-col">
            {/* Scrollable content */}
            <div
              ref={textRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 hide-scrollbar"
            >
              {terminalLines.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {/* Prompt area */}
            <div className="flex items-center p-4">
              <span className="mr-2">{">"}</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                  className="absolute left-0 top-0 w-full opacity-0"
                  autoFocus
                />
                <span className="whitespace-pre">{inputDisplay}</span>
                <span className="animate-blink">█</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
