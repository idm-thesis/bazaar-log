"use client";
import { useEffect, useRef, useState } from "react";
import { useCalendarStore, calendarInterval } from "@/store/useCalendarStore";
type GameContentItem = (typeof gameContent)[number];
import Tutorial from "./ui/tutorial";

// import { useCodeGenerationMechanics } from "@/hooks/useCodeGenerationMechanics";
import { useGameEffects } from "@/hooks/useGameEffects";
import gameContent from "@/data/Bazaar_log_game_content.json";

export default function PreInternet() {
  const [freePlayMode, setFreePlayMode] = useState(false);

  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingSpeed = 10;
  const typingLineDelay = 200;

  const { currentYear, nextYear } = useCalendarStore();
  const [calendarMode, setCalendarMode] = useState(false);

  const softLine = "--------------------------------------------";
  const hardLine = "────────────────────────────────────────────";

  const listResponse = [
    "",
    "AVAILABLE COMMANDS",
    "    calendar      View the yearly calendar",
    "    news          View the latest news articles",
    "    workstation   Develop tools at your free time, build your community for code sharing",
    "    notebook      View TODO list",
    "    lan           Check Local Area Network messages",
    "    list          List all available commands",
    "    help          Get detailed information about Bazaar.log",
    "",
  ];

  const helpResponse = [
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
    "    The game has 5 functions: notebook, news, local area network, calendar, and workstation:",
    "    Notebook: read your To-dos of the year.",
    "    News: read news of the year about technology and more.",
    "    Local Area Network (LAN): browse online community discussions about news, communications among your colleages at lab, and more.",
    "    Calendar: By turning the calendar, you can drive the game forward or backward in time.",
    "    Workstation: place to develop your tools and build your open-source community. Write code, publish tools, and view real-time statistics of your open-source career.",
    "",
  ]

  useGameEffects(); // Runs all effect logic

  const [currentContentList, setCurrentContentList] = useState<
    GameContentItem[]
  >([]);

  useEffect(() => {
    const startYear = currentYear - (calendarInterval - 1);
    const filteredContent = gameContent.filter((item) => {
      return item.year >= startYear && item.year <= currentYear;
    });
    filteredContent.sort((a, b) => a.year - b.year);
    setCurrentContentList(filteredContent);
  }, [currentYear]);

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

  // Initial welcome message when the component mounts
  const bootedRef = useRef(false);
  // const [tutorialActive, setTutorialActive] = useState(true);
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
        "Now is the year 1970. You are a university lab researcher working on network technology. Recently, your lab developed a local area network using ARPANET technology and would like to test it.",
        `${softLine}`,
        "** Tutorial **: To get started, let's go to your notebook to see your to-do list. Type [NOTEBOOK] in the console and then press [Enter].",
        "",
      ];

      await typeLinesWithCharacters(bootLines, typingSpeed);

      setIsTyping(false);
      // setTutorialActive(true);
      setFreePlayMode(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    bootSequence();
  }, []);

  const handleCommand = async (input: string) => {
    let responseLines: string[] = [];

    if (input === "help") {
      responseLines = helpResponse;
      responseLines.push(`${hardLine}`);
    } else if (input === "list") {
      responseLines = listResponse;
      responseLines.push(`${hardLine}`);
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
        `To-do's (${currentYear - (calendarInterval - 1)} - ${currentYear}) :`,
      ];
      if (currentContentList.length === 0) {
        responseLines.push("You didn't record any to-dos in the past 5 years.");
      } else {
        currentContentList.forEach((item) => {
          if (item.notebook !== undefined) {
            responseLines.push(
              `${softLine}`,
              `Year        : ${item.year}`,
              "\n"
            );
            item.notebook.forEach((note) => {
              responseLines.push(`- ${note}`);
            });
            responseLines.push("\n");
          }
        });
      }
      responseLines.push("[Exiting Notebook]", `${hardLine}`);
    } else if (input === "news") {
      responseLines = [
        "[Loading...]",
        "[News]",
      ];
      if (currentContentList.length === 0) {
        responseLines.push("No news available for the past 5 year.");
      } else {
        currentContentList.forEach((item) => {
          if (item.news !== undefined) {
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
            });
          }
        });
      }
      responseLines.push("[Exiting News]", `${hardLine}`);
    } else if (input === "lan") {
      responseLines = [
        "[Loading...]",
        "[Local Area Network]",
        "Local Area Network communications",
      ];
      if (currentContentList.length === 0) {
        responseLines.push("No LAN communication for the past 5 year.");
      } else {
        currentContentList.forEach((item) => {
          if (item.lan_posts !== undefined) {
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
            });
          }
        });
      }
      responseLines.push("[Exiting LAN]", `${hardLine}`);
    } else if (input === "workstation") {
      responseLines = [
        "Workstation under construction. Expected year to complete: 1990.",
      ];
      responseLines.push(`${hardLine}`);
    } else {
      responseLines = [
        `Unknown command: "${input}"`,
        `Type 'help' to get detailed information.`,
      ];
    }

    if (calendarMode) {
      // Calendar navigation logic
      await typeLine(`> ${input}`);
      if (input === "n") {
        nextYear();
        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            const updatedYear = useCalendarStore.getState().currentYear;
            await updateCalendarDisplay(updatedYear);
            resolve();
          }, 0)
        });
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
    } else {
      await typeLine(`> ${input}`);
    }

    await typeLinesWithCharacters(responseLines, typingSpeed);
  };

  const tutorial = Tutorial({
    onComplete: async () => {
      await typeLine(
        "** Tutorial **: Tutorial completed! Now you may want to exit the calendar mode to explore news, LAN communications, and notebook content updated to 1975. And remember, you can always check list of avaiable command by entering [LIST]."
      );
      setFreePlayMode(true);
    },
    typeLine,
    handleCommand,
  });

  const handleUserInput = async () => {
    const input = userInput.trim().toLowerCase();
    if (isTyping) return;
    setUserInput("");
    setInputDisplay("");
    setIsTyping(true);

    // Handle tutorial before entering free play
    if (!freePlayMode) {
      await tutorial.handleTutorialInput(input);
      setIsTyping(false);
      return;
    }

    // await typeLinesWithCharacters(responseLines, typingSpeed);
    await handleCommand(input);
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
    setTerminalLines((prev) => [...prev, "[Exiting Calendar]", `${hardLine}`]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperInput = e.target.value.toUpperCase();
    setUserInput(upperInput);
    setInputDisplay(upperInput);
  };

  // Function: auto-scroll to bottom of text
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Function: update calendar year
  const updateCalendarDisplay = async (year: number) => {
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

    // setTerminalLines((prev) => [...prev, ...lines]);
    for (const line of lines) {
      await typeText(line); // Ensures sequential typing!
      await new Promise((res) => setTimeout(res, typingLineDelay));
    }
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
