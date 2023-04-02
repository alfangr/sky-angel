import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FuelImage from "@assets/images/fuel.png";

interface IFuelProps {
  fill: number;
  onFuelZero: () => void;
}

export default function Fuel({ fill, onFuelZero }: IFuelProps) {
  const [remainingFuel, setRemainingFuel] = useState(fill);
  const [intervalId, setIntervalId] = useState<number>(0);

  useEffect(() => {
    setIntervalId(
      window.setInterval(() => {
        setRemainingFuel((prevRemainingFuel) => prevRemainingFuel - 1);
      }, 1000)
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [fill]);

  useEffect(() => {
    if (remainingFuel <= 0) {
      onFuelZero();
      clearInterval(intervalId);
    }
  }, [remainingFuel, onFuelZero]);

  return (
    <>
      <Image
        className="w-7 h-7 object-contain"
        src={FuelImage}
        alt="Fuel Icon"
      />
      <span className="text-white text-xl font-bold">{remainingFuel}%</span>
    </>
  );
}
