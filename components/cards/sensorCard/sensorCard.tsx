"use client";

import { CardWrapper } from "@/components/cards/sensorCard/card-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SmokeGauge } from "../smoke-gauge/smoke-gauge";
import GaugeChart from "react-gauge-chart";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

interface Sensor {
  id: string;
  sensorName: string;
  status: string;
  location: string;
  lastReadingId: string | null;
  userId: string;
}

interface SensorCardProps {
  data: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ data }) => {
  const [percent, setPercent] = useState<number>();
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const getGaugeData = () => {
    socket.emit("getSmokeLevel", data.id);
  };

  useEffect(() => {
    getGaugeData();
  }, []);

  useEffect(() => {
    // Listen for smokeLevel event from the server

    socket.on("smokeLevel", (smokeLevel) => {
      const res = convertToPercentage(smokeLevel);
      setPercent(res);
    });

    // Listen for lastReadingUpdated event from the server
    socket.on("lastReadingUpdated", ({ sensorId, smokeLevel }) => {
      // Update the percent if the updated sensorId matches the one we are interested in
      const res = convertToPercentage(smokeLevel);
      if (sensorId === "662154e4ff1d109ac770e0c2") {
        setPercent(res);
      }
    });

    // Listen for errors from the server
    socket.on("error", (message) => {
      console.error("Error:", message);
    });

    return () => {
      socket.off("smokeLevel");
      socket.off("error");
    };
    // const interval = setInterval(getGaugeData, 5000); // Poll every 5 seconds
    // return () => clearInterval(interval)
  }, [socket]);

  function convertToPercentage(value: any, reference = 50) {
    const percentage = value / reference;
    return percentage;
  }

  return (
    <CardWrapper>
      <div className="flex items-center justify-center p-6 bg-slate-200 rounded-md shadow-lg">
        <GaugeChart
          id="gauge-chart5"
          nrOfLevels={420}
          arcsLength={[0.3, 0.5, 0.2]}
          colors={["#5BE12C", "#F5CD19", "#EA4228"]}
          percent={percent}
          arcPadding={0.02}
          textColor="5BE12C"
          needleColor="#345243"
        />
      </div>
      <div className="flex items-center justify-between p-4 ">
        <h3>{data.sensorName}</h3>
        <Button className="text-xs md:text-sm">Settings</Button>
      </div>
    </CardWrapper>
  );
};
