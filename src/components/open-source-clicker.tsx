"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function OpenSourceGalaxyUI() {
  const [influence, setInfluence] = useState(90000);
  const [organizations, setOrganizations] = useState(16);
  const [productivity, setProductivity] = useState(20);
  const [valueGenerated, setValueGenerated] = useState(5000000);

  return (
    <div className="grid grid-cols-3 gap-2 min-h-screen">
      {/* Left Panel: All Text Information */}
      <div className="space-y-6 m-2 col-span-1">
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">Personal Information</h2>
            <p><strong>Name:</strong> Macaroni</p>
            <p><strong>Role:</strong> Open-source Organization Founder</p>
            <p><strong>Personal Influence:</strong> {influence.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">Environment</h2>
            <p><strong>Era:</strong> Artificial Intelligence</p>
            <p><strong>Information Transmission Speed:</strong> 1,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">Contribution</h2>
            <p><strong>Total Productivity:</strong> {productivity} tools/sec</p>
            <p><strong>Number of Organizations:</strong> {organizations}</p>
            <p><strong>Value Generated:</strong> {valueGenerated.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">News</h2>
            <p className="italic">“AGI projects have become a new target of capital support.”</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">Decisions</h2>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setInfluence(influence + 5000)}>Invest in AGI</Button>
              <Button variant="outline" onClick={() => setOrganizations(organizations + 1)}>Support Open-Source AI</Button>
              <Button variant="destructive" onClick={() => setInfluence(influence - 5000)}>Ban AI Contributions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Center & Right Panel: Visualization Fully Centered */}
      <div className="col-span-2 flex justify-center items-center min-h-screen">
        <div className="p-6 border bg-gray-100 flex flex-col items-center w-full min-h-screen">
          <h2 className="text-lg font-bold mb-4">Open-Source Ecosystem</h2>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 border-4 border-yellow-500 bg-white flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-5 h-5 bg-blue-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

