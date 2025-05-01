"use client";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useState, useEffect } from "react";
import { useWinBoxStore } from "@/store/useWinBoxStore";
import { useGameStore } from "@/store/gameStore";
// import FutureLANWindow from "./windows/futureLAN";
import FutureNewsWindow from "./windows/futureNews";
import futureNewsData from "@/data/futureNews.json";
import Particles from "@/blocks/Backgrounds/Particles/Particles";
import ScrollVelocity from "@/blocks/TextAnimations/ScrollVelocity/ScrollVelocity";
import FutureLANWindow from "./windows/futureLAN";
import FutureProposalFormWindow from "./windows/futureProposalForm";

export default function Future() {
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    useWinBoxStore.getState().clearAllBoxes();
  }, []);

  // const eraStr = "future";
  // const [displayInputField, setDisplayInputField] = useState(false);
  const { resetGame } = useGameStore();

  const velocity = 100;

  return isClient ? (
    <div className="relative w-full flex flex-col items-center justify-center text-black min-h-screen overflow-hidden">
      <div className="z-10 relative">
        <div className="w-full h-screen flex flex-col items-center justify-center space-y-6">
          <ScrollVelocity
            texts={["Open Source Future"]}
            velocity={velocity}
            numCopies={8}
            damping={20}
            stiffness={200}
            velocityMapping={{
              input: [0, 1500],
              output: [0, 20],
            }}
            className="font-mono text-[2rem] tracking-tight whitespace-nowrap"
          />
        </div>
      </div>

      <div className="fixed inset-0 -z-10">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="z-10 relative">
        {/* Testing 1*/}
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <p className="text-2xl max-w-xl text-center">
            The era of open source we knew is gone...
          </p>
        </div>
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <p className="text-2xl max-w-xl text-center">
            How will its future be like?
          </p>
        </div>
        {/* Choose from Futures */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          <h2 className="text-center col-span-1 md:col-span-2 lg:col-span-5 my-8 text-2xl">
            Open Source Daily Issues<br/>(from the future)
          </h2>
          <FutureNewsWindow
            era={"future"}
            titleSummary={futureNewsData[0]["title-summary"]}
          />
          <FutureNewsWindow
            era={"future"}
            titleSummary={futureNewsData[1]["title-summary"]}
          />
          <FutureNewsWindow
            era={"future"}
            titleSummary={futureNewsData[2]["title-summary"]}
          />
          <FutureNewsWindow
            era={"future"}
            titleSummary={futureNewsData[3]["title-summary"]}
          />
        </div>

        {/* Share your view */}
        <section className="w-full items-center justify-center space-y-6 my-16">
          <p className="text-lg">
            Voice your vision.
          </p>
          <div className="flex justify-center gap-4">
            {/* Propose a future */}
            <FutureProposalFormWindow era="future" />
            {/* See proposals */}
            <div className="w-full flex flex-col items-center justify-center animate-fade-in">
              <FutureLANWindow era="future" />
            </div>
            {/* Game Restart */}
            <button onClick={() => resetGame()} className="futureBtn">
              Restart
            </button>
          </div>
        </section>
      </div>
    </div>
  ) : null;
}
