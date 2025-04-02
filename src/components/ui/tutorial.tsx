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
    "** Tutorial **: To get started, let's go to your notebook to see what to do next. Type [NOTEBOOK] in the console and then press [Enter].",
    "** Tutorial **: When not sure about what to do next, you can always go back to [NOTEBOOK] for ideas. Now, let's follow [NOTEBOOK] to-do's to check out NEWS, LAN, and CALENDAR, one at a time. Type [NEWS] and enter to read the latest news about technology and more.",
    "** Tutorial **: Curious about how your colleages react to the news? Enter [LAN] to test your lab's local area network, and check out people's comments on news.",
    "** Tutorial **: You just tested your lab's local area network, and it works. You have almost all you need now: [NOTEBOOK], [NEWS], and [LAN]. But don't just stay in the 1970 -- enter [CALENDAR] to see how you can move forward in time. ",
    "** Tutorial **: Now you are in the [CALENDAR] mode. Enter [N] to move 5 years forward in time."
  ];

  const expectedInputs = ["notebook", "news", "lan", "calendar", "n"];

  let tutorialCompleted = false;

  // let calendarMode = false;

  const handleTutorialInput = async (input: string) => {
    if (input === expectedInputs[tutorialStep]) {
      // Execute the same command as in free play mode
      await handleCommand(input);

      // Move to the next step after command execution
      setTutorialStep(tutorialStep + 1);

      if (tutorialStep === expectedInputs.length - 1) {
        await typeLine("** Tutorial **: Tutorial completed! Now you may want to exit the calendar mode to explore news, LAN communications, and notebook content updated to 1975.And remember, you can always check list of avaiable command by entering [LIST].");
        // Tutorial is completed
        tutorialCompleted = true;
        onComplete(); // Notify parent to switch to free play mode
      } else {
        // Show the next tutorial step
        await typeLine(tutorialSteps[tutorialStep + 1]);
      }
    } else {
      await typeLine(`Invalid command. Try again: ${tutorialSteps[tutorialStep]}`);
      // if (tutorialStep === 4) {
      //   handleCommand("calendar");
      //   calendarMode = true;
      // }
    }
  };

  return { handleTutorialInput, tutorialStep, tutorialCompleted };
};

export default Tutorial;
