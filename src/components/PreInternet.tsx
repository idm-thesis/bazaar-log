"use client";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useTutorial } from "./cli-game/useTutorial";

import { supabase } from "@/lib/supabaseClient";
import { useContentDecisionStore } from "@/store/useContentDecisionStore";
import { useNewsStore } from "@/store/useNewsStore";
import { useLANStore } from "@/store/useLANStore";
import { useNotebookStore } from "@/store/useNotebookStore";

import { useGameEffects } from "@/hooks/useGameEffects";
import { useWinBoxStore } from "@/store/useWinBoxStore";

import { createTyping } from "./cli-game/useTyping";
import { useCommandHandler } from "./cli-game/useCommandHandler";

export const typingSpeed = 10;
export const typingLineDelay = 200;
export default function PreInternet() {
  // Clear all winboxes if any
  useEffect(() => {
    useWinBoxStore.getState().clearAllBoxes();
  }, []);

  // Get all contentDecisions
  const { contentDecisionList, setContentDecisionList } =
    useContentDecisionStore();
  useEffect(() => {
    const fetchAllContentDecisions = async () => {
      const { data, error } = await supabase
        .from("contentDecisions")
        .select("*");
      if (error) {
        console.error("Error fetching all content decisions:", error);
      } else {
        setContentDecisionList(data);
      }
    };
    fetchAllContentDecisions();
  }, [setContentDecisionList]);

  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentYear, nextYear, calendarInterval, gamePhase, setGamePhase } =
    useGameStore();
  const resetGame = useGameStore((state) => state.resetGame);
  const [calendarMode, setCalendarMode] = useState(false);

  // Decision Module
  const [pendingDecision, setPendingDecision] = useState<string | null>(null);

  useGameEffects(); // Runs all effect logic

  const { typeText, typeLine, typeLinesWithCharacters } = createTyping(
    setTerminalLines,
    textRef,
    typingSpeed,
    typingLineDelay
  );

  // const [currentContentList, setCurrentContentList] = useState<
  //   GameContentItem[]
  // >([]);

  // Get current news
  const { news, setNews } = useNewsStore();
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .gt("year", currentYear - calendarInterval)
        .lte("year", currentYear)
        .order("year", { ascending: true });
      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setNews(data);
      }
    };
    fetchNews();
  }, [setNews, currentYear]);

  // Get current lan
  const { lan, setLAN } = useLANStore();
  useEffect(() => {
    const fetchLAN = async () => {
      const { data, error } = await supabase
        .from("lan_posts")
        .select("*")
        .gt("year", currentYear - calendarInterval)
        .lte("year", currentYear)
        .order("year", { ascending: true });
      if (error) {
        console.error("Error fetching lan post:", error);
      } else {
        setLAN(data);
      }
    };
    fetchLAN();
  }, [setLAN, currentYear]);

  // Get current notebook entries
  const { notebook, setNotebook } = useNotebookStore();
  useEffect(() => {
    const fetchNotebook = async () => {
      const { data, error } = await supabase
        .from("notebook")
        .select("*")
        .gt("year", currentYear - calendarInterval)
        .lte("year", currentYear)
        .order("year", { ascending: true });
      if (error) {
        console.error("Error fetching notebook:", error);
      } else {
        setNotebook(data);
      }
    };
    fetchNotebook();
  }, [setNotebook, currentYear]);
  // useEffect(() => {
  //   const startYear = currentYear - (calendarInterval - 1);
  //   const filteredContent = gameContent.filter((item) => {
  //     return item.year >= startYear && item.year <= currentYear;
  //   });
  //   filteredContent.sort((a, b) => a.year - b.year);
  //   setCurrentContentList(filteredContent);
  // }, [currentYear]);

  const [inputDisplay, setInputDisplay] = useState("");
  const { handleCommand, handleInputChange, softLine, hardLine } =
    useCommandHandler({
      news,
      lan,
      notebook,
      contentDecisionList,
      currentYear,
      calendarInterval,
      calendarMode,
      typingSpeed,
      typingLineDelay,

      setPendingDecision,
      setCalendarMode,
      setTerminalLines,

      typeLine,
      typeText,
      typeLinesWithCharacters,

      nextYear,

      setIsTyping,
      setInputDisplay,
      setUserInput,
    });

  const { handleTutorialInput, startTutorial } = useTutorial({
    onComplete: async () => {
      await typeLine(
        `** Tutorial **: Tutorial completed! Now you may want to exit the calendar mode to explore news, LAN communications, and notebook content updated to 1975. And remember, you can always check the list of available commands by entering [LIST].\n** Tutorial **: Tutorial Completed.\n${softLine}`
      );
      setGamePhase("freeplay");
    },
    typeLine,
    handleCommand,
  });

  // Add audio
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);

  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio(
      "/audio/User Interface, Data, Computer, Classic, Working, Loading, Processing, Long 02 SND109569.wav"
    );
    audio.loop = true;
    audio.volume = 0.2;
    audio.addEventListener("canplaythrough", () => {
      typingAudioRef.current = audio;
      setAudioLoaded(true);
    });
  }, []);

  useEffect(() => {
    const audio = typingAudioRef.current;
    if (!audio) return;

    if (isTyping) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn("Typing sound play failed:", e));
    } else {
      audio.pause();
    }
  }, [isTyping]);

  // Game Phase 1: Loading
  useEffect(() => {
    if (gamePhase === "loading" && audioLoaded) {
      const timeout = setTimeout(() => {
        setGamePhase("boot");
      }, 500); // or 1000ms if needed
      return () => clearTimeout(timeout);
    }
  }, [gamePhase, audioLoaded]);

  // Game Phase 2: Booting
  const bootStartedRef = useRef(false);
  useEffect(() => {
    const bootSequence = async () => {
      console.log("✅ Running boot sequence");
      setIsTyping(true);
      const bootLines = [
        "[Booting Bazaar.log v0.1]",
        "[Initializing Memory Check... OK]",
        "[Loading Modules... OK]",
        "[Establishing Network Connection... OK]",
        "",
        "Now is the year 1970. You are a university lab researcher working on network technology. Recently, your lab developed a local area network using ARPANET technology and would like to test it.",
        `${softLine}`,
        "Would you like to go though the game tutorial?",
        "Please type [YES] or [NO].",
        "",
      ];

      await typeLinesWithCharacters(
        bootLines,
        typingSpeed,
        typingLineDelay,
        true
      );
      setIsTyping(false);
      inputRef.current?.focus();

      // Move this inside the sequence
      setGamePhase("tutorial");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    if (gamePhase === "boot" && !bootStartedRef.current && audioLoaded) {
      bootStartedRef.current = true;
      void bootSequence();
    }
  }, [gamePhase, audioLoaded]);

  // Game Phase 3: Tutorial
  const tutorialStartedRef = useRef(false);
  // Handle user input based on current phase
  const handleUserInput = async () => {
    const input = userInput.trim().toLowerCase();
    if (isTyping) return;
    setUserInput("");
    setInputDisplay("");
    setIsTyping(true);

    switch (gamePhase) {
      case "boot":
        console.warn("Unexpected input during boot phase:", input);
        break;
      case "tutorial":
        if (!tutorialStartedRef.current) {
          if (input === "yes") {
            tutorialStartedRef.current = true;
            await startTutorial();
          } else if (input === "no") {
            setGamePhase("freeplay");
            await typeLine(
              "You may now explore freely. Type [HELP] or [LIST] for available commands."
            );
            await typeLine(hardLine);
          } else {
            await typeLine("Please type [YES] or [NO].");
          }
        } else {
          await handleTutorialInput(input);
        }

        break;
      case "freeplay":
        if (pendingDecision) {
          const currentDecision = contentDecisionList.find(
            (decision) => decision.decision_id === pendingDecision
          );

          if (input === "1" || input === "2") {
            setPendingDecision(null);
            if (input === "1") {
              await typeLinesWithCharacters(
                [
                  "",
                  `${input}`,
                  `[Outcome: ${currentDecision?.["choice-end-title"]}]`,
                  `${currentDecision?.["choice-end-outcome"]}`,
                  "",
                  // "THE END",
                  "You may now continue exploring the network.",
                  hardLine,
                  // "Press [Enter] to restart...",
                ],
                typingSpeed,
                typingLineDelay,
                true
              );
              // setGamePhase("restart");
            } else {
              await typeLinesWithCharacters(
                [
                  "",
                  `${input}`,
                  `[Outcome: ${currentDecision?.["choice-success-title"]}]`,
                  `${currentDecision?.["choice-success-outcome"]}`,
                  "",
                  "You may now continue exploring the network.",
                  hardLine,
                ],
                typingSpeed,
                typingLineDelay,
                true
              );
            }
            if (pendingDecision) {
              useGameStore.getState().markDecisionAsMade(pendingDecision); // ✅ NEW
            }
          } else {
            await typeLine(`Invalid input: "${input}". Type 1 or 2.`);
          }
        } else {
          await handleCommand(input);
        }
        break;
      case "restart":
        setTerminalLines([]);
        setIsTyping(false);
        bootStartedRef.current = false;
        setTimeout(() => {
          setGamePhase("boot");
          resetGame();
          inputRef.current?.focus();
        }, 10);
        return;
      default:
        console.warn("Unknown game phase: ", gamePhase);
        break;
    }
    // Handle pending decision
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

  // Function: auto-scroll to bottom of text
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Observe pending decision status
  useEffect(() => {
    console.log("🟡 pendingDecision updated:", pendingDecision);
  }, [pendingDecision]);

  return (
    <div
      id="screen"
      className="flex items-center justify-center w-screen h-screen"
    >
      <div
        id="bezel"
        className="relative w-[80vw] h-[60vh] border-[10px] border-transparent"
      >
        {gamePhase === "loading" ? (
          <div className="crt relative w-full h-full bg-transparent text-green-400 text-xl overflow-hidden">
            <div className="scanline pointer-events-none" />
            <div className="terminal w-full h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-1 hide-scrollbar">
                LOADING...
              </div>
            </div>
          </div>
        ) : (
          // Existing terminal interface
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
        )}
      </div>
    </div>
  );
}
