"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

const getRandomFruit = (): Fruit => fruits[Math.floor(Math.random() * fruits.length)];

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  useEffect(() => {
    if (!isSpinning) return;
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [getRandomFruit(), ...row.slice(0, 2)]);
        return newGrid;
      });
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning) return;
    // Check rows
    for (const row of grid) {
      if (row.every(f => f === row[0])) {
        setWin(`You won with ${row[0]}s!`);
        return;
      }
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      const colValues = grid.map(r => r[col]);
      if (colValues.every(f => f === colValues[0])) {
        setWin(`You won with ${colValues[0]}s!`);
        return;
      }
    }
    setWin(null);
  }, [grid, isSpinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <button
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => setIsSpinning(true)}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">{win}</span>
          <Share text={`${win} ${url}`} />
        </div>
      )}
    </div>
  );
}
