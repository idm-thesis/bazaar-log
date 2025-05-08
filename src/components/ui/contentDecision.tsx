"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// import { useGameStore } from "@/store/gameStore";
// import contentDecisionData from "@/data/contentDecisions.json";
import { useContentDecisionStore } from "@/store/useContentDecisionStore";
import { supabase } from "@/lib/supabaseClient";

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
  const {contentDecision, setContentDecision } = useContentDecisionStore();
  // const currentDecision = contentDecisionData.find(decision => decision.id === triggerId);
  // const resetGame = useGameStore((state) => state.resetGame);
  useEffect(() => {
      const fetchContentDecision = async () => {
        const { data, error } = await supabase
          .from("contentDecisions")
          .select("*")
          .eq("decision_id", triggerId);
          if (error) {
            console.error("Error fetching Content Decision:", error);
          } else if (data && data.length > 0) {
            console.log("📦 Raw ContentDecision:", data[0]);
            setContentDecision(data[0]);
          } else {
            console.warn("No content decision found for triggerId:", triggerId);
          }          
      };
      fetchContentDecision();
    }, [setContentDecision, triggerId]);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        {/* Initial decision */}
        {!outcome && (
          <>
            <h2 className="text-xl font-bold mb-4">{contentDecision?.title}</h2>
            <p className="mb-6">
              {contentDecision?.context}
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-red-200 hover:bg-red-300 rounded"
                onClick={() => setOutcome("end")}
              >
                {contentDecision?.["choice-end"]}
              </button>
              <button
                className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded"
                onClick={() => setOutcome("success")}
              >
                {contentDecision?.["choice-success"]}
              </button>
            </div>
          </>
        )}

        {/* Outcome: Ending */}
        {outcome === "end" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{contentDecision?.["choice-end-title"]}</h2>
            <p className="mb-4">
              {contentDecision?.["choice-end-outcome"]}
            </p>
            {/* <button
              className="mt-4 px-4 py-2 bg-red-200 hover:bg-red-300 rounded"
              onClick={() => {
                onClose(); // hide the modal so user sees fresh game
              }}
            >
              Restart Game
            </button> */}
            <button
              className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        )}

        {/* Outcome: Success */}
        {outcome === "success" && (
          <div>
            <h2 className="text-xl font-bold mb-4">{contentDecision?.["choice-success-title"]}</h2>
            <p className="mb-6">
              {contentDecision?.["choice-success-outcome"]}
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
