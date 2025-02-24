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

  const formatNumber = (value: number | undefined | null) => {
    return typeof value === "number" ? value.toLocaleString() : "";
  };

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
          {show_personal_influence && personal_influence !== undefined && (
            <p>
              <strong>Personal Influence:</strong>{" "}
              {formatNumber(personal_influence)}
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
            {formatNumber(information_transmission_speed)}
          </p>
          {show_number_of_users && number_of_users !== undefined && (
            <p>
              <strong>Number of Users:</strong> {formatNumber(number_of_users)}
            </p>
          )}
          {show_number_of_contributors && number_of_contributors !== undefined && (
            <p>
              <strong>Number of Contributors:</strong>{" "}
              {formatNumber(number_of_contributors)}
            </p>
          )}
          {show_number_of_collaborators && number_of_contributors !== undefined && (
            <p>
              <strong>Number of Collaborators:</strong>{" "}
              {formatNumber(number_of_collaborators)}
            </p>
          )}
        </div>
        <div className="border-t-2 pt-2">
          <h2 className="text-lg font-bold">Contribution</h2>
          {show_next_tool && next_tool_numerator !== undefined && next_tool_denominator !== undefined && (
            <div>
              <p>
                <strong>Next Tool:</strong> {formatNumber(next_tool_numerator)}{" "}
                / {formatNumber(next_tool_denominator)} lines of code
              </p>
              <Progress
                value={(next_tool_numerator / next_tool_denominator) * 100}
                className="my-2"
              />
            </div>
          )}
          {show_number_of_tools && number_of_tools !== undefined && (
            <p>
              <strong>Number of Tools Developed:</strong>{" "}
              {formatNumber(number_of_tools)}
            </p>
          )}
          {show_tool_productivity && tool_productivity !== undefined && (
            <p>
              <strong>Productivity:</strong> {formatNumber(tool_productivity)}{" "}
              lines/second
            </p>
          )}
          {show_value_generation_speed && value_generation_speed !== undefined && (
            <p>
              <strong>Value Generation Speed:</strong>{" "}
              {formatNumber(value_generation_speed)} $/second
            </p>
          )}
          {show_value_generated && value_generated !== undefined && (
            <p>
              <strong>Total Value Generated:</strong>{" "}
              {formatNumber(value_generated)}
            </p>
          )}
          {show_number_of_organizations && number_of_organizations !== undefined && (
            <p>
              <strong>Number of Organizations:</strong>{" "}
              {formatNumber(number_of_organizations)}
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
          {isClient ? (
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="bg-gray-800 text-white p-3 rounded-lg cursor-pointer"
            onClick={() => writeCode(1)}
          >
            <FaCode />
          </motion.div>
          ) : null}
        </div>
      </div>
      {/* <div className="fixed bottom-4 left-4 bg-white bg-opacity-80 p-2 m-2 hover:text-orange-400 duration-300 transition text-3xl text-primary">
        <SlBadge/>
      </div> */}
    </div>
  ) : null;
}
