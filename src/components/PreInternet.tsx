"use client";
import { useEffect, useRef, useState } from "react";
import { useCalendarStore, calendarInterval } from "@/store/useCalendarStore";
import { useGameStore } from "@/store/gameStore"; // Get the state type from your store
type GameState = ReturnType<typeof useGameStore.getState>;
type GameContentItem = typeof gameContent[number];

import { useCodeGenerationMechanics } from "@/hooks/useCodeGenerationMechanics";
import { useGameEffects } from "@/hooks/useGameEffects";
import gameContent from "@/data/Bazaar_log_game_content.json";

export default function PreInternet() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingSpeed = 10;
  const typingLineDelay = 200;

  const { currentYear, nextYear } = useCalendarStore();
  const [bootYear] = useState(currentYear);
  const [calendarMode, setCalendarMode] = useState(false);
  const [dashboardMode, setDashboardMode] = useState(false);

  const {
    name,
    role,
    personal_influence,
    information_transmission_speed,
    number_of_users,
    next_tool_numerator,
    next_tool_denominator,
    number_of_tools,
    value_generated,
  } = useGameStore();
  const prevDashboardState = useRef<GameState>({} as GameState);
  const { writeCode } = useCodeGenerationMechanics();

  const softLine = "--------------------------------------------";
  const hardLine = "────────────────────────────────────────────";

  const showDashboardUpdates = () => {
    const currentState = useGameStore.getState(); // get latest values

    const diffs: string[] = [];

    // Helper: Compare each key and add to diffs if different
    const compareAndPush = (key: keyof GameState, label: string) => {
      const prevValue = prevDashboardState.current[key];
      const currentValue = currentState[key];

      if (prevValue !== currentValue) {
        diffs.push(`${label.padEnd(28)}: ${currentValue}`);
      }
    };

    // PERSONAL INFORMATION SECTION
    compareAndPush("name", "Name");
    compareAndPush("role", "Role");
    compareAndPush("personal_influence", "Personal Influence");
    // ENVIRONMENT SECTION
    compareAndPush(
      "information_transmission_speed",
      "Information Transfer Speed"
    );
    compareAndPush("number_of_users", "Number of Users");

    // WORKING PROGRESS SECTION
    // WORKING PROGRESS SECTION (special case for numerator/denominator)
    const prevNumerator = prevDashboardState.current.next_tool_numerator;
    const prevDenominator = prevDashboardState.current.next_tool_denominator;
    const currentNumerator = currentState.next_tool_numerator;
    const currentDenominator = currentState.next_tool_denominator;

    const numeratorChanged = prevNumerator !== currentNumerator;
    const denominatorChanged = prevDenominator !== currentDenominator;

    if (numeratorChanged) {
      diffs.push(
        `Progress to Next Tool   : ${currentNumerator} / ${currentDenominator}`
      );
    } else if (denominatorChanged) {
      // Show denominator if it changed and numerator didn't
      diffs.push(
        `Progress to Next Tool   : ${currentNumerator} / ${currentDenominator}`
      );
    }
    compareAndPush("number_of_tools", "Number of Tools");

    // IMPACT AND VALUE SECTION
    compareAndPush("value_generated", "Value Generated");

    // Update previous dashboard snapshot
    prevDashboardState.current = { ...currentState };

    // Update previous state for next comparison
    prevDashboardState.current = { ...currentState };

    if (diffs.length === 0) {
      diffs.push("No changes detected.");
    }

    setTerminalLines((prev) => [
      ...prev,
      `[Dashboard Update]`,
      ...diffs,
      `${softLine}`,
    ]);
  };

  useGameEffects(); // Runs all effect logic

  const [currentContentList, setCurrentContentList] = useState<GameContentItem[]>([]);

  useEffect(() => {
    const startYear = currentYear - (calendarInterval - 1);
    const filteredContent = gameContent.filter((item) => {
      return item.year >= startYear && item.year <= currentYear;
    });
    filteredContent.sort((a, b) => a.year - b.year);
    setCurrentContentList(filteredContent);
  },[currentYear]);

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

    if (calendarMode) {
      // Calendar navigation logic
      await typeLine(`${input}`);
      if (input === "n") {
        nextYear();
        setTimeout(() => {
          const updatedYear = useCalendarStore.getState().currentYear;
          updateCalendarDisplay(updatedYear);
        }, 0);
      } else if (input === "q") {
        exitCalendarMode();
      } else {
        setTerminalLines((prev) => [
          ...prev,
          `${softLine}`,
          "[Calendar]",
          `Invalid input: "${input}"`,
          `Current Year: ${currentYear}`,
          "Actions:",
          "- [N] Move forward 5 years",
          "- [Q] Exit Calendar",
        ]);
      }
      // Reset input after handling command
      setUserInput("");
      setInputDisplay("");
      setIsTyping(false);
      return; // Don't run normal command handling
    } else if (dashboardMode) {
      await typeLine(`${input}`);
      if (input === "q") {
        exitDashboardMode();
      } else if (input === "") {
        setTerminalLines((prev) => [
          ...prev,
          `${softLine}`,
          "[Dashboard]",
          "Invalid empty input",
          "Actions:",
          `- Enter anything and press [Enter] to commit a line of code to your next tool`,
          `- [Q] Exit Dashboard Mode`,
        ]);
      } else {
        writeCode(1);
        showDashboardUpdates();
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
        "    Bazaar.log is a browser-based game to introduce the past, present, and future of the Internet and the open-source ecosystem.",
        "",
        "LONG DESCRIPTION",
        "    Bazaar.log is a browser-based game to introduce the past, present, and future of the Internet and the open-source ecosystem. In this game, you are a developer working at a university's computer lab.",
        "    There are two things you can do in Bazaar.log: 1) explore the history of the Internet and the open-source ecosystem, and 2) work on your open-source career, starting from a developer. You will be making some decisions along the way to help progress the game story.",
        "    You have 5 functions to play with: news, dashboard, notebook, local area network, and calendar:",
        "    News: read news of the year about technology and more.",
        "    Dashboard: place to develop and view your open-source career. Write code, publish software, and view statistics available about your career.",
        "    Notebook: read your To-dos of the year.",
        "    Local Area Network (LAN): browse online community discussions about news, communications among your colleages at lab, and more.",
        "    Calendar: By turning the calendar, you can drive the game forward or backward in time.",
        "",
      ];
    } else if (input === "list") {
      responseLines = [
        "",
        "AVAILABLE COMMANDS",
        "    news        View the latest news articles",
        "    dashboard   Display work progress dashboard",
        "    notebook    View TODO list",
        "    calendar    View the yearly calendar",
        "    lan         Check Local Area Network messages",
        "    list        List all available commands",
        "    help        Get detailed information about Bazaar.log",
        "",
      ];
    } else if (input === "calendar") {
      setCalendarMode(true);
      responseLines = [
        "[Loading...]",
        "[Calendar]",
        `Current Year: ${currentYear}`,
        "Actions:",
        "- [N] Move forward 5 years",
        "- [Q] Exit Calendar Mode",
      ];
    } else if (input === "notebook") {
      responseLines = [
        "[Loading...]",
        "[Notebook]",
        `To-do's (${currentYear - (calendarInterval - 1)} - ${currentYear}) :`
      ];
      if (currentContentList.length === 0) {
        responseLines.push(
          "You didn't record any to-dos in the past 5 years.",
        )
      } else {
        currentContentList.forEach((item) => {
          responseLines.push(
            `${softLine}`,
            `Year        : ${item.year}`,
            "\n"
          );
          item.notebook.forEach((note) => {
            responseLines.push(`- ${note}`);
          });
          responseLines.push("\n");
        });
      }
      responseLines.push(
        "[Exiting Notebook]", 
        `${hardLine}`
      )
    } else if (input === "dashboard") {
      setDashboardMode(true);
      prevDashboardState.current = useGameStore.getState(); // Capture baseline
      responseLines = [
        "[Loading...]",
        "[Dashboard - Open-Source Career Status Report]",
        `${softLine}`,
        "Personal Information",
        `Name                    : ${name}`,
        `Role                    : ${role}`,
        `Personal Influence      : ${personal_influence}`,
        `${softLine}`,

        "Environment",
        `Year                    : ${currentYear}`,
        `Information Transfer Speed : ${information_transmission_speed}`,
        `Number of Users         : ${number_of_users}`,
        `${softLine}`,

        "Working Progress",
        `Progress to Next Tool   : ${next_tool_numerator} / ${next_tool_denominator}`,
        `Number of Tools         : ${number_of_tools}`,
        `${softLine}`,

        "Impact and Value",
        `Value Generated         : ${value_generated}`,
        `${softLine}`,

        "Enter anything and press [Enter] to commit a line of code to your next tool.",
        "Exit dashboard [Q]: ",
      ];
    } else if (input === "news") {
      responseLines = [
        "[Loading...]",
        "[News]",
        `News from ${currentYear - (calendarInterval - 1)} to ${currentYear}:`
      ];
      if (currentContentList.length === 0) {
        responseLines.push("No news available for the past 5 year.");
      } else {
        currentContentList.forEach((item) => {
          responseLines.push(
            `${softLine}`,
            `Year        : ${item.year}`,
            "\n"
          );
          item.news.forEach((news) => {
            responseLines.push(
            `Headline    : ${news.headline}`,
            `Summary     : ${news.summary}`,
            "\n"
            );
          })
        });
      }
      responseLines.push(
        "[Exiting News]", 
        `${hardLine}`
      )
    } else if (input === "lan") {
      responseLines = [
        "[Loading...]",
        "[Local Area Network]",
        `Local Area Network communications from ${currentYear - (calendarInterval - 1)} to ${currentYear}:`
      ];
      if (currentContentList.length === 0) {
        responseLines.push("No LAN communication for the past 5 year.");
      } else {
        currentContentList.forEach((item) => {
          responseLines.push(
            `${softLine}`,
            `Year        : ${item.year}`,
            "\n"
          );
          item.lan_posts.forEach((post) => {
            responseLines.push(
            `Title       : ${post.title}`,
            `Author      : ${post.author}`,
            `Content     : ${post.content}`,
            "\n"
            );
          })
        });
      }
      responseLines.push(
        "[Exiting LAN]", 
        `${hardLine}`
      )
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
    setTerminalLines((prev) => [
      ...prev, 
      "[Exiting Calendar]", 
      `${hardLine}`
    ]);
  };

  const exitDashboardMode = () => {
    setDashboardMode(false);
    setTerminalLines((prev) => [...prev, "[Exiting Dashboard]", `${hardLine}`]);
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
        "Welcome to the Bazaar.log. Current year: " + bootYear + ".",
        `${softLine}`,
        "Available Commands:",
        "    news        View the latest news articles",
        "    dashboard   Display work progress dashboard",
        "    notebook    View TODO list",
        "    calendar    View the yearly calendar",
        "    lan         Check Local Area Network messages",
        "    list        List all available commands",
        "    help        Get detailed information about Bazaar.log",
        "",
        "Type 'list' to see all commands or 'help' for game details.",
        `${hardLine}`,
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
      `${softLine}`,
      "[Calendar]",
      "Success! Year advanced by 5 years.",
      `Current Year: ${year}`,
      "Check out the latest news, local area network communications, and notebook in the past 5 years.",
      "Actions:",
        "- [N] Move forward 5 years",
        "- [Q] Exit Calendar Mode",
    ];

    setTerminalLines((prev) => [...prev, ...lines]);
  };

  return (
    <div
      id="screen"
      className="flex items-center justify-center w-screen h-screen"
    >
      <div
        id="bezel"
        className="relative w-[80vw] h-[60vh] border-[10px] border-transparent"
      >
        <div className="crt relative w-full h-full bg-transparent text-green-400 text-xl overflow-hidden">
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
