"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useGameStore } from "@/store/gameStore";
import contentDecisionData from "@/data/contentDecisions.json";

interface DecisionModalProps {
  triggerId: string;
  onClose: () => void;
}

export default function DecisionModal({
  triggerId,
  onClose,
}: DecisionModalProps) {
  // const setContentDecisions = useGameStore(
  //   (state) => state.setContentDecisions
  // );
  const [outcome, setOutcome] = useState<"success" | "end" | null>(null);
  const currentDecision = contentDecisionData.find(decision => decision.id === triggerId);
  const resetGame = useGameStore((state) => state.resetGame);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        {/* Initial decision */}
        {!outcome && (
          <>
            <h2 className="text-xl font-bold mb-4">{currentDecision?.title}</h2>
            <p className="mb-6">
              {currentDecision?.context}
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => setOutcome("end")}
              >
                {currentDecision?.["choice-end"]}
              </button>
              <button
                className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded"
                onClick={() => setOutcome("success")}
              >
                {currentDecision?.["choice-success"]}
              </button>
            </div>
          </>
        )}

        {/* Outcome: Ending */}
        {outcome === "end" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{currentDecision?.["choice-end-title"]}</h2>
            <p className="mb-4">
              {currentDecision?.["choice-end-outcome"]}
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
            <h2 className="text-xl font-bold mb-4">{currentDecision?.["choice-success-title"]}</h2>
            <p className="mb-6">
              {currentDecision?.["choice-success-outcome"]}
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
