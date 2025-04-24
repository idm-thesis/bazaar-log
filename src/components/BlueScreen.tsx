"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect, useRef } from "react";
import { useWinBoxStore } from "@/store/useWinBoxStore";
import { createTyping } from "./cli-game/useTyping";
import { useGameStore } from "@/store/gameStore";

export default function BlueScreen() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    useWinBoxStore.getState().clearAllBoxes();
  }, []);

  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [phase, setPhase] = useState<"panic" | "installing" | "complete">(
    "panic"
  );

  const { typeLinesWithCharacters } = createTyping(setTerminalLines, textRef);

  const { setGameStage, setBlueScreenCompleted } = useGameStore();
  const blueScreenBooted = useRef(false);
  const panicLines = [
    "*** SYSTEM HALTED ***",
    "FATAL ERROR: CLOCK.C::MILLENNIUM++ OVERFLOW",
    "",
    "PATCH LOG:",
    " - 1999: CORPORATE PANIC.EXE INITIALIZED",
    " - 1999.9: GOVERNMENTS DEPLOY COBOL STRIKE TEAMS",
    "",
    "*** SUGGESTION: INSTALL LINUX TO CONTINUE ***",
    "",
    "PRESS [ENTER] TO INSTALL LINUX...",
  ];
  const linuxInstallLines = [
    "",
    ">> CONNECTING TO OPEN SOURCE MIRROR...",
    ">> DOWNLOADING community_patch.2k.tar.gz",
    ">> EXTRACTING FILES...",
    ">> UPDATING CLOCK SYSTEM...",
    ">> INSTALL COMPLETE.",
    "",
    ">> RETRY SOLVING Y2K PROBLEM...",
    ">> REBOOT -T +2000",
  ];
  const solvingY2K = [
    "",
    "*** STOP: 0x0001F4A9 (OPEN_SOURCE_REBOOT)",
    "*** SUCCESS: COMMUNITY_PATCH.2K AT ADDRESS 0xCAFEBABE EXECUTED SUCCESSFULLY",
    "",
    "PATCH LOG:",
    " - 2000: USER INSTALLS LINUX; BUG MYSTERIOUSLY VANISHES",
    "",
    "OPEN SOURCE DOESN’T PANIC.",
    "OPEN SOURCE REWRITES THE SYSTEM.",
    "",
    "PRESS [ENTER] TO INSTALL LINUX...",
  ];

  useEffect(() => {
    const blueScreenBootSequence = async () => {
      await typeLinesWithCharacters(panicLines); // Phase 1
      setIsTypingDone(true); // Wait for enter key here
    };

    if (!blueScreenBooted.current) {
      blueScreenBooted.current = true;
      void blueScreenBootSequence();
    }
  }, []);

  useEffect(() => {
    if (phase === "installing") {
      const installLinux = async () => {
        setIsTypingDone(false);
        await typeLinesWithCharacters(linuxInstallLines, 10, 200, true);
        await new Promise((res) => setTimeout(res, 5000));
        await typeLinesWithCharacters(solvingY2K, 10, 200, true);
        setIsTypingDone(true);
        inputRef.current?.focus();
      };
      installLinux();
    }
  }, [phase]);
  
  useEffect(() => {
    if (phase === "complete") {
      setBlueScreenCompleted(true);
      setGameStage("web2000");
    }
  }, [phase]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTypingDone) {
      if (e.key !== "Enter") {
        return;
      } else {
        if (phase === "panic") {
          setPhase("installing");
        } else if (phase === "installing") {
          setPhase("complete");
        }
      }
    }
  };  

  return isClient ? (
    <div className="text-white text-lg">
      {/* <h1 className="text-9xl">:)</h1> */}
      <div ref={textRef}>
        {terminalLines.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line === "" ? "\u00A0" : line}
          </div>
        ))}
        {isTypingDone && <span className="animate-blink">█</span>}
      </div>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className="absolute left-0 top-0 w-full opacity-0"
        autoFocus
      />
    </div>
  ) : null;
}
