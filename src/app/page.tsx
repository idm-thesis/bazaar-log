"use client";
import dynamic from "next/dynamic";
// import { useState } from "react";

const Web1990 = dynamic(() => import("@/components/Web1990"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen" style={{background: '#555555'}}>
      <Web1990 />
    </div>
  );
}
