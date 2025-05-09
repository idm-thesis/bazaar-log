// import { GameContentItem } from "@/components/cli-game/dataTypes";
import type { News } from "@/store/useNewsStore";
import type { LAN } from "@/store/useLANStore";
import type { NotebookEntry } from "@/store/useNotebookStore";
import type { ContentDecision } from "@/store/useContentDecisionStore";
import { useGameStore } from "@/store/gameStore";
import { hasPendingDecisions } from "../blockForDecision/blockForDecision";

interface CommandHandlerProps {
  news: News[];
  lan: LAN[];
  notebook: NotebookEntry[];
  contentDecisionList: ContentDecision[];

  currentYear: number;
  calendarInterval: number;
  calendarMode: boolean;
  typingSpeed: number;
  typingLineDelay: number;

  setPendingDecision: (val: string | null) => void;
  setCalendarMode: (val: boolean) => void;
  setTerminalLines: React.Dispatch<React.SetStateAction<string[]>>;

  typeLine: (line: string) => Promise<void>;
  typeText: (text: string) => Promise<void>;
  typeLinesWithCharacters: (
    lines: string[],
    speed: number,
    lineDelay: number,
    append: boolean
  ) => Promise<void>;

  nextYear: () => void;

  setIsTyping: (val: boolean) => void;
  setInputDisplay: (val: string) => void;
  setUserInput: (val: string) => void;
}

export const useCommandHandler = ({
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
}: CommandHandlerProps) => {
  const { decisionStatusList } = useGameStore();
  const softLine = "--------------------------------------------";
  const hardLine = "────────────────────────────────────────────";

  const listResponse = [
    "",
    "AVAILABLE COMMANDS",
    "    calendar      Display the annual calendar (View the current year, and advance to future years)",
    "    news          Access the latest news articles",
    "    workstation   Develop tools at your free time, build your community for code sharing",
    "    notebook      View your personal TODO list",
    "    lan           Access the Local Area Network messages",
    "    list          List all available commands",
    "    help          Access detailed system information and usage instructions.",
    "",
  ];

  const helpResponse = [
    "",
    "GAME NAME",
    "    Bazaar.log",
    "",
    "SHORT DESCRIPTION",
    "    Bazaar.log is a browser-based game to introduce the past, present, and future of the Internet and the open-source ecosystem.",
    "",
    "LONG DESCRIPTION",
    "    Bazaar.log is a browser-based game to introduce the past, present, and future of the Internet and the open-source ecosystem. In this game, you are a developer working at a university's computer lab.",
    "    There are two things you can do in Bazaar.log: 1) explore the history of the Internet and the open-source ecosystem, and 2) work on your open-source career, starting from a developer. You will be making some decisions along the way to help progress the game story.",
    "    The game has 5 functions: notebook, news, local area network, calendar, and workstation:",
    "    Notebook: read your To-dos of the year.",
    "    News: read news of the year about technology and more.",
    "    Local Area Network (LAN): browse online community discussions about news, communications among your colleages at lab, and more.",
    "    Calendar: By turning the calendar, you can drive the game forward or backward in time.",
    "    Workstation: place to develop your tools and build your open-source community. Write code, publish tools, and view real-time statistics of your open-source career.",
    "",
  ];

  // Function: update calendar year
  const updateCalendarDisplay = async (year: number) => {
    const lines = [
      `${softLine}`,
      "[Calendar]",
      "Success! Year advanced by 5 years.",
      `Current Year: ${year}`,
      "Check out the latest news, local area network communications, and notebook in the past 5 years.",
      "Actions:",
      "- [N] Move forward 5 years",
      "- [Q] Exit Calendar Mode",
    ];

    // setTerminalLines((prev) => [...prev, ...lines]);
    for (const line of lines) {
      await typeText(line);
      await new Promise((res) => setTimeout(res, typingLineDelay));
    }
  };

  const exitCalendarMode = () => {
    setCalendarMode(false);
    setTerminalLines((prev) => [...prev, "[Exiting Calendar]", `${hardLine}`]);
  };

  const handleCommand = async (input: string) => {
    let responseLines: string[] = [];

    if (input === "help") {
      responseLines = helpResponse;
      responseLines.push(`${hardLine}`);
    } else if (input === "list") {
      responseLines = listResponse;
      responseLines.push(`${hardLine}`);
    } else if (input === "calendar") {
      setCalendarMode(true);
      if (
        hasPendingDecisions(currentYear, decisionStatusList, calendarInterval)
      ) {
        await typeLine("> calendar");
        await typeLinesWithCharacters(
          [
            "[Loading...]",
            "[Calendar]",
            `Current Year: ${currentYear}`,
            "There are pending decisions to make in this era. Go to [news] or [lan] to learn more.",
            "[Exiting Calendar]",
            hardLine,
          ],
          typingSpeed,
          typingLineDelay,
          true
        );
        setCalendarMode(false);
        setUserInput("");
        setInputDisplay("");
        setIsTyping(false);
        return; // prevent further execution
      } else {
        responseLines = [
          "[Loading...]",
          "[Calendar]",
          `Current Year: ${currentYear}`,
          "Actions:",
          "- [N] Move forward 5 years",
          "- [Q] Exit Calendar Mode",
        ];
      }
    } else if (input === "notebook") {
      responseLines = [
        "[Loading...]",
        "[Notebook]",
        `To-do's (${currentYear - (calendarInterval - 1)} - ${currentYear}) :`,
      ];

      if (notebook.length === 0) {
        responseLines.push("Nothing to do in the past 5 years.");
      } else {
        const notesByYear: Record<number, string[]> = {};

        notebook.forEach((entry) => {
          if (!notesByYear[entry.year]) {
            notesByYear[entry.year] = [];
          }
          notesByYear[entry.year].push(entry.note); // ✅ 正确取出 note 字段
        });

        // 可选：按年份排序输出
        Object.entries(notesByYear)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([year, notes]) => {
            responseLines.push(`${softLine}`, `Year        : ${year}`, "");
            notes.forEach((note) => {
              responseLines.push(`- ${note}`);
            });
            responseLines.push("");
          });
      }

      responseLines.push("[Exiting Notebook]", `${hardLine}`);
    } else if (input === "news") {
      responseLines = ["[Loading...]", "[News]"];

      let currentDecision: ContentDecision | null = null;
      let finalDecisionTrigger: string | null = null;

      if (news.length === 0) {
        responseLines.push("No news available for the past 5 year.");
      } else {
        news.forEach((newsItem) => {
          responseLines.push(
            `${softLine}`,
            `Year        : ${newsItem.year}`,
            `Headline    : ${newsItem.headline}`,
            `Summary     : ${newsItem.summary}`,
            "\n"
          );

          if (newsItem.decisionTrigger) {
            const alreadyDecided = decisionStatusList.find(
              (d) => d.id === newsItem.decisionTrigger
            )?.hasDecided;

            if (!alreadyDecided) {
              const found = contentDecisionList.find(
                (d) => d.decision_id === newsItem.decisionTrigger
              );
              if (found) {
                currentDecision = found;
                finalDecisionTrigger = newsItem.decisionTrigger;
              }
            }
          }
        });
      }

      responseLines.push("[Exiting News]", `${hardLine}`);

      if (currentDecision && finalDecisionTrigger) {
        responseLines.push(
          `** Decision: ${currentDecision["title"]} **`,
          `${currentDecision["context"]}`,
          "",
          `(1) ${currentDecision["choice-end"]}`,
          `(2) ${currentDecision["choice-success"]}`,
          "Type 1 or 2 to decide:"
        );
        setPendingDecision(finalDecisionTrigger);
      } else {
        setPendingDecision(null);
      }
    } else if (input === "lan") {
      responseLines = [
        "[Loading...]",
        "[Local Area Network]",
        "Local Area Network communications",
      ];
      if (lan.length === 0) {
        responseLines.push("No LAN communication for the past 5 year.");
      } else {
        lan.forEach((post) => {
          responseLines.push(
            `${softLine}`,
            `Year        : ${post.year}`,
            `Title       : ${post.title}`,
            `Author      : ${post.author}`,
            `Content     : ${post.content}`,
            "\n"
          );

          if (post.decisionTrigger) {
            const alreadyDecided = decisionStatusList.find(
              (d) => d.id === post.decisionTrigger
            )?.hasDecided;

            if (!alreadyDecided) {
              const found = contentDecisionList.find(
                (d) => d.decision_id === post.decisionTrigger
              );
              if (found) {
                responseLines.push(
                  `** Decision: ${found.title} **`,
                  `${found.context}`,
                  "",
                  `(1) ${found["choice-end"]}`,
                  `(2) ${found["choice-success"]}`,
                  "Type 1 or 2 to decide:"
                );
                setPendingDecision(post.decisionTrigger);
              }
            }
          }
        });
      }
      responseLines.push("[Exiting LAN]", `${hardLine}`);
    } else if (input === "workstation") {
      responseLines = [
        "Workstation under construction. Expected year to complete: 1990.",
      ];
      responseLines.push(`${hardLine}`);
    } else {
      responseLines = [
        `Unknown command: "${input}"`,
        `Type 'help' to get detailed information.`,
      ];
    }

    if (calendarMode) {
      // Calendar navigation logic
      await typeLine(`> ${input}`);
      if (input === "n") {
        const hasBlock = hasPendingDecisions(
          currentYear,
          decisionStatusList,
          calendarInterval
        );
        if (hasBlock) {
          await typeLinesWithCharacters(
            [
              "[Calendar]",
              "Failed to move forward by 5 years. Pending decision(s) in [news] and/or [lan] mode.",
              `Current Year: ${currentYear}`,
            ],
            typingSpeed,
            typingLineDelay,
            true
          );
          exitCalendarMode();
        } else {
          if (currentYear + calendarInterval >= 1990) {
            setIsTyping(false);
            nextYear();
            exitCalendarMode();
            return;
          } else {
            nextYear();
            await new Promise<void>((resolve) => {
              setTimeout(async () => {
                const updatedYear = useGameStore.getState().currentYear;
                await updateCalendarDisplay(updatedYear);
                resolve();
              }, 0);
            });
          }
        }
      } else if (input === "q") {
        exitCalendarMode();
      } else {
        setTerminalLines((prev) => [
          ...prev,
          `${softLine}`,
          "[Calendar]",
          `Invalid input: "${input}"`,
          `Current Year: ${currentYear}`,
          "Actions:",
          "- [N] Move forward 5 years",
          "- [Q] Exit Calendar",
        ]);
      }
      // Reset input after handling command
      setUserInput("");
      setInputDisplay("");
      setIsTyping(false);
      return; // Don't run normal command handling
    } else {
      await typeLine(`> ${input}`);
    }

    await typeLinesWithCharacters(
      responseLines,
      typingSpeed,
      typingLineDelay,
      true
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperInput = e.target.value.toUpperCase();
    setUserInput(upperInput);
    setInputDisplay(upperInput);
  };

  return {
    handleCommand,
    handleInputChange,
    softLine,
    hardLine,
  };
};
