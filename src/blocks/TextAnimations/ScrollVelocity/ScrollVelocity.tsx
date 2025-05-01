import React from "react";
import useScrollTicker from "./VelocityText";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = () => {
  const ticker1 = useScrollTicker({ text: "OPEN SOURCE", className: "text-4xl md:text-6xl font-bold tracking-tighter font-mono" });
  const ticker2 = useScrollTicker({ text: "SUSTAINABLE FUTURE", baseVelocity: -100, className: "text-4xl md:text-6xl font-bold tracking-tighter font-mono" });
  return (
    <section>
      {ticker1}
      {ticker2}
    </section>
  );
};

export default ScrollVelocity;
