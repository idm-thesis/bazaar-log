"use client";
import { useGameStore } from "@/store/gameStore";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Web1990 = dynamic(() => import("@/components/Web1990"), { ssr: false });
const PreInternet = dynamic(() => import("@/components/PreInternet"), {
  ssr: false,
});
const Web2000 = dynamic(() => import("@/components/Web2000"), { ssr: false });

export default function GameRouter() {
  useEffect(() => {
    console.log("Mounted for the first time.");
  }, []);

  function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value < max;
  }

  const { currentYear } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // prevent mismatch by rendering only after mount
  }, []);

  if (!mounted) return null;

  // Testing
  // return (<div id="monitor" className="min-h-screen" style={{background: '#000'}}>
  //   <PreInternet />
  // </div>);
  if (isInRange(currentYear, 1970, 1991)) {
    return (<div id="monitor" className="min-h-screen" style={{background: '#000'}}>
      <PreInternet />
    </div>);
  } else if (isInRange(currentYear, 1991, 2001)) {
    return (
    <div className="min-h-screen" style={{background: '#555555'}}>
      <Web1990 />
    </div>
  );
  } else if (isInRange(currentYear, 2001, 2011)) {
    console.log("Get to stage 3");
    return (
      <div className="min-h-screen" style={{background: '#555555'}}>
        <Web2000 />
      </div>
    );
  }
}
