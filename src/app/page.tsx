"use client";
import dynamic from "next/dynamic";

const OpenSourceClicker = dynamic(() => import("@/components/open-source-clicker"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      <OpenSourceClicker />
    </div>
  );
}
