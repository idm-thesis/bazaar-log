"use client";
import { useGameStore } from "@/store/gameStore";
import { useCodeGenerationMechanics } from "@/hooks/useCodeGenerationMechanics";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
// import { SlBadge } from "react-icons/sl";
import { FaCode } from "react-icons/fa6";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useTimeBasedUpdates } from "@/hooks/useTimeBasedUpdates";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useDecisionSystem } from "@/hooks/useDecisionSystem";

export default function OpenSourceGalaxyUI() {
  const {
    name,
    role,
    show_personal_influence,
    personal_influence,
    information_transmission_speed,
    show_number_of_users,
    number_of_users,
    show_number_of_contributors,
    number_of_contributors,
    show_number_of_collaborators,
    number_of_collaborators,
    show_next_tool,
    next_tool_numerator,
    next_tool_denominator,
    show_number_of_tools,
    number_of_tools,
    show_value_generated,
    value_generated,
    show_tool_productivity,
    tool_productivity,
    show_value_generation_speed,
    value_generation_speed,
    show_number_of_organizations,
    number_of_organizations,
  } = useGameStore();

  const { writeCode } = useCodeGenerationMechanics();
  const { decisions } = useDecisionSystem();
  const { era } = useTimeBasedUpdates();
  useGameEffects(); // Runs all effect logic

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return isClient ? (
    <div className="grid grid-cols-3 gap-6 min-h-screen">
      <div className="col-span-1 m-2 space-y-3">
        <div>
          <h2 className="text-lg font-bold">Personal Information</h2>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
          {show_personal_influence && (
            <p>
              <strong>Personal Influence:</strong>{" "}
              {typeof personal_influence === "number"
                ? personal_influence.toLocaleString()
                : ""}
            </p>
          )}
        </div>
        <div className="border-t-2 pt-2">
          <h2 className="text-lg font-bold">Environment</h2>
          <p>
            <strong>Era:</strong> {era}
          </p>
          <p>
            <strong>Information Transmission Speed:</strong>{" "}
            {information_transmission_speed.toLocaleString()}
          </p>
          {show_number_of_users && (
            <p>
              <strong>Number of Users:</strong>{" "}
              {typeof number_of_users === "number"
                ? number_of_users.toLocaleString()
                : ""}
            </p>
          )}
          {show_number_of_contributors && (
            <p>
              <strong>Number of Contributors:</strong>{" "}
              {typeof number_of_contributors === "number"
                ? number_of_contributors.toLocaleString()
                : ""}
            </p>
          )}
          {show_number_of_collaborators && (
            <p>
              <strong>Number of Collaborators:</strong>{" "}
              {typeof number_of_collaborators === "number"
                ? number_of_collaborators.toLocaleString()
                : ""}
            </p>
          )}
        </div>
        <div className="border-t-2 pt-2">
          <h2 className="text-lg font-bold">Contribution</h2>
          {show_next_tool && (
            <div>
              <p>
                <strong>Next Tool:</strong>{" "}
                {typeof next_tool_numerator === "number"
                  ? next_tool_numerator.toLocaleString()
                  : ""}{" "}
                /{" "}
                {typeof next_tool_denominator === "number"
                  ? next_tool_denominator.toLocaleString()
                  : ""}{" "}
                lines of code
              </p>
              <Progress
                value={(next_tool_numerator / next_tool_denominator) * 100}
                className="my-2"
              />
            </div>
          )}
          {show_number_of_tools && (
            <p>
              <strong>Number of Tools Developed:</strong>{" "}
              {number_of_tools.toLocaleString()}
            </p>
          )}
          {show_tool_productivity && (
            <p>
              <strong>Productivity:</strong>{" "}
              {tool_productivity.toLocaleString()} lines/second
            </p>
          )}
          {show_value_generation_speed && (
            <p>
              <strong>Value Generation Speed:</strong>{" "}
              {value_generation_speed.toLocaleString()} /second
            </p>
          )}
          {show_value_generated && (
            <p>
              <strong>Total Value Generated:</strong>{" "}
              {value_generated.toLocaleString()}
            </p>
          )}
          {show_number_of_organizations && (
            <p>
              <strong>Number of Organizations:</strong>{" "}
              {number_of_organizations.toLocaleString()}
            </p>
          )}
        </div>
        <div className="border-t-2 pt-2">
          <h2 className="text-lg font-bold">News</h2>
          <p className="italic">“Welcome to Open-Source Clicker.”</p>
        </div>
        <div className="border-t-2 pt-2">
          <h2 className="text-lg font-bold">Decisions</h2>
          {decisions.map((decision) => (
            <div key={decision.id} className="border p-2 my-2">
              <p>{decision.text}</p>
              {decision.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={choice.effect}
                  className="mr-2 p-1 border select-none"
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center col-span-2 min-h-full bg-slate-300">
        <div className="m-2">
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="bg-gray-800 text-white p-3 rounded-lg cursor-pointer"
            onClick={() => writeCode(1)}
          >
            <FaCode />
          </motion.div>
        </div>
      </div>
      {/* <div className="fixed bottom-4 left-4 bg-white bg-opacity-80 p-2 m-2 hover:text-orange-400 duration-300 transition text-3xl text-primary">
        <SlBadge/>
      </div> */}
    </div>
  ) : null;
}
