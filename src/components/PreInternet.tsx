"use client";
import { useEffect, useRef, useState } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";

export default function PreInternet() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentYear } = useCalendarStore();
  const [bootYear] = useState(currentYear);

  // Simulates typing one line of text (not letter by letter here)
  const typeLine = async (line: string, delay: number = 500): Promise<void> => {
    return new Promise((resolve) => {
      setTerminalLines((prevLines) => [...prevLines, line]);
      setTimeout(() => resolve(), delay);
    });
  };

  // Simulates typing multiple lines
  const typeLines = async (lines: string[], delay: number = 500) => {
    for (const line of lines) {
      await typeLine(line, delay);
    }
  };

  const handleUserInput = async () => {
    const input = userInput.trim().toLowerCase();
    if (!input || isTyping) return;

    setTerminalLines((prevLines) => [...prevLines, `> ${input}`]);

    setUserInput("");
    setInputDisplay("");
    setIsTyping(true);

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
      responseLines = [`Yearly Calendar: ${currentYear}`];
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

    await typeLines(responseLines, 100);

    setIsTyping(false);
    setUserInput("");
    setInputDisplay("");

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

      await typeLines(bootLines, 100);
      setIsTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    bootSequence();
  }, []); // ✅ No dependencies

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const [inputDisplay, setInputDisplay] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperInput = e.target.value.toUpperCase();
    setUserInput(upperInput);
    setInputDisplay(upperInput);
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
            <div ref={textRef} className="flex-1 overflow-y-auto p-4 space-y-1 hide-scrollbar">
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
