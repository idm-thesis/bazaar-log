"use client";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/store/useCalendarStore";
// import { useState } from "react";

const Web1990 = dynamic(() => import("@/components/Web1990"), { ssr: false });
const PreInternet = dynamic(() => import("@/components/PreInternet"), {ssr: false});

export default function Home() {
  function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value < max;
  }
  const {currentYear} = useCalendarStore();
  if (isInRange(currentYear, 1970, 1991)) {
    return (<div id="screen" className="min-h-screen" style={{background: '#000'}}>
      <PreInternet />
    </div>);
  } else if (isInRange(currentYear, 1991, 2010)) {
    return (
    <div className="min-h-screen" style={{background: '#555555'}}>
      <Web1990 />
    </div>
  );
  }
  
}
