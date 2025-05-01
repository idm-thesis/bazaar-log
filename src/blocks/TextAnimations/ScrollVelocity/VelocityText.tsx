// useScrollTicker.tsx
"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.scrollWidth); // More accurate for inline content
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

interface UseScrollTickerOptions {
  text: string;
  baseVelocity?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  damping?: number;
  stiffness?: number;
  velocityMapping?: {
    input: [number, number];
    output: [number, number];
  };
  className?: string;
  copiesBuffer?: number; // how many extra copies
}

export default function useScrollTicker({
  text,
  baseVelocity = 80,
  scrollContainerRef,
  damping = 20,
  stiffness = 200,
  velocityMapping = { input: [0, 2000], output: [0, 20] },
  className = "",
  copiesBuffer = 30,
}: UseScrollTickerOptions) {
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef
    ? { container: scrollContainerRef }
    : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(
    copyRef as React.RefObject<HTMLSpanElement>
  );
  const directionFactor = useRef(1);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, copyWidth, v)}px`;
  });

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const estimatedCopies =
    copyWidth > 0
      ? Math.ceil(window.innerWidth / copyWidth) + copiesBuffer
      : 10;

  const totalCopies = Math.max(estimatedCopies, 5);

  const rendered = (
    <div className="relative overflow-hidden">
      <motion.div
        className={`flex whitespace-nowrap ${className}`}
        style={{ x }}
      >
        {Array.from({ length: totalCopies }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? copyRef : null}
            className="flex-shrink-0"
          >
            {text}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );

  return rendered;
}
