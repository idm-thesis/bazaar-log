"use client";
import WinBox from "@/components/windows/WinBox";
import futureNews from "@/data/futureNews.json";

export default function FutureNewsWindow({
  era,
  titleSummary,
}: {
  era: string;
  titleSummary: string;
}) {
  const newsItem = futureNews.find(
    (item) => item["title-summary"] === titleSummary
  );
  return (
    <WinBox
      id="news"
      title={titleSummary}
      width="600px"
      height="400px"
      era={era}
    >
      <div className="window-body">
        <div
          key={newsItem?.["title-summary"]}
        >
          <h2>Open Source Daily</h2>
          <p>{newsItem?.tag}</p>
          <h3 className="text-green-400 text-xl font-semibold">
            {newsItem?.title}
          </h3>
          <p>{newsItem?.date}</p>
          <p>{newsItem?.content}</p>
        </div>
      </div>
    </WinBox>
  );
}
