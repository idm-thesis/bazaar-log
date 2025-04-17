"use client";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/store/useCalendarStore";
// import { useState } from "react";

const Web1990 = dynamic(() => import("@/components/Web1990"), { ssr: false });
const PreInternet = dynamic(() => import("@/components/PreInternet"), {ssr: false});
const Web2000 = dynamic(()=>import("@/components/Web2000"),{ssr:false});

export default function Home() {
  function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value < max;
  }
  const {currentYear} = useCalendarStore();
  // Testing
  return (
    <div className="min-h-screen" style={{background: '#555555'}}>
      <Web2000 />
    </div>
  );
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
    return (
      <div className="min-h-screen" style={{background: '#555555'}}>
        <Web2000 />
      </div>
    );
  }
  
}
