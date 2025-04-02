"use client";
import { useState } from "react";

interface TutorialProps {
  onComplete: () => void;
  typeLine: (line: string) => Promise<void>;
  handleCommand: (input: string) => Promise<void>;
}

const Tutorial = ({ onComplete, typeLine, handleCommand }: TutorialProps) => {
  const [tutorialStep, setTutorialStep] = useState(0);

  const tutorialSteps = [
    "To get started, let's go to your notebook to see what to do next. Type [NOTEBOOK] in the console and then press [Enter].",
    "When not sure about what to do next, you can always go back to [NOTEBOOK] for ideas. Now, let's follow [NOTEBOOK] to-do's to check out NEWS, LAN, and CALENDAR, one at a time. Type [NEWS] and enter to read the latest news about technology and more.",
    "Curious about how your colleages react to the news? Enter [LAN] to test your lab's local area network, and check out people's comments on news.",
    "You just tested your lab's local area network, and it works. You have almost all you need now: [NOTEBOOK], [NEWS], and [LAN]. But don't just stay in the 1970 -- enter [CALENDAR] to see how you can move forward in time. ",
    "Now you are in the [CALENDAR] mode. Enter [N] to move 5 years forward in time.",
  ];

  const expectedInputs = ["notebook", "news", "lan", "calendar", "n"];

  const handleTutorialInput = async (input: string) => {
    if (input === expectedInputs[tutorialStep]) {
      await handleCommand(input);
      const nextStep = tutorialStep + 1;
      if (nextStep < expectedInputs.length) {
        setTutorialStep(nextStep);
        await typeLine("** Tutorial **: " + tutorialSteps[nextStep]);
      } else {
        onComplete();
      }
    } else {
      await typeLine(
        `> ${input}\n** Tutorial **: Invalid command. Try again:\n${tutorialSteps[tutorialStep]}`
      );
    }
  };

  return { handleTutorialInput };
};

export default Tutorial;
