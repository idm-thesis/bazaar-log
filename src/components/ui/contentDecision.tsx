"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useGameStore } from "@/store/gameStore";

interface DecisionModalProps {
  triggerId: string;
  onClose: () => void;
}

export default function DecisionModal({
  triggerId,
  onClose,
}: DecisionModalProps) {
  const setContentDecisions = useGameStore(
    (state) => state.setContentDecisions
  );
  const [outcome, setOutcome] = useState<"success" | "end" | null>(null);

  const handleDecision = (choice: string) => {
    setContentDecisions(triggerId, choice);

    // Simple logic: mark "proprietary" as ending, "open-source" as success
    if (triggerId === "bill-gates-letter" && choice === "proprietary") {
      setOutcome("end");
    } else {
      setOutcome("success");
    }
  };
  const resetGame = useGameStore((state) => state.resetGame);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        {/* Initial decision */}
        {!outcome && (
          <>
            <h2 className="text-xl font-bold mb-4">Decision Required</h2>
            <p className="mb-6">
              Bill Gates urges hobbyists to pay for software.
              <br />
              What will you do?
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => handleDecision("proprietary")}
              >
                Support proprietary software
              </button>
              <button
                className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded"
                onClick={() => handleDecision("open-source")}
              >
                Start open-source software collaboration
              </button>
            </div>
          </>
        )}

        {/* Outcome: Ending */}
        {outcome === "end" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">The End</h2>
            <p className="mb-4">
              Your lab continued with proprietary UNIX. Eventually, you couldn’t
              bear the financial burden and had to shut down. ☹️
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-200 hover:bg-red-300 rounded"
              onClick={() => {
                resetGame();
                onClose(); // hide the modal so user sees fresh game
              }}
            >
              Restart Game
            </button>
          </div>
        )}

        {/* Outcome: Success */}
        {outcome === "success" && (
          <div>
            <h2 className="text-xl font-bold mb-4">You Chose Collaboration</h2>
            <p className="mb-6">
              You co-created an open-source OS with other institutions. The
              community is growing.
            </p>
            <button
              className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
