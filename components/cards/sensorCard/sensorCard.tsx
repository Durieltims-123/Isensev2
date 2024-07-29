"use client";

import { CardWrapper } from "@/components/cards/sensorCard/card-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SmokeGauge } from "../smoke-gauge/smoke-gauge";
import GaugeChart from "react-gauge-chart";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { EditSensorModal } from "@/components/modal/edit-sensor";
import { Sensor } from "@prisma/client";


interface SensorCardProps {
  data: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onConfirm = async () => {};
  //   const onConfirm = async () => {
  //     const res = await createSensor(data);
  //     if (res !== null) {
  //       console.log("Success");
  //     } else {
  //       console.log("error");
  //     }
  //   };

  

  const [percent, setPercent] = useState<number>();
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const getGaugeData = () => {
    socket.emit("getSmokeConcentration", data.id);
  };

  useEffect(() => {
    getGaugeData();
  }, []);

  useEffect(() => {
    // Listen for smokeConcentration event from the server

    socket.on("smokeConcentration", (smokeConcentration) => {
      const res = convertToPercentage(smokeConcentration);
      setPercent(res);
    });

    // Listen for lastReadingUpdated event from the server
    socket.on("lastReadingUpdated", ({ sensorId, smokeConcentration }) => {
      // Update the percent if the updated sensorId matches the one we are interested in
      const res = convertToPercentage(smokeConcentration);
      if (sensorId !== null)  {
        setPercent(res);
      }
    });

    // Listen for errors from the server
    socket.on("error", (message) => {
      console.error("Error:", message);
    });

    return () => {
      socket.off("smokeConcentration");
      socket.off("error");
    };
    // const interval = setInterval(getGaugeData, 5000); // Poll every 5 seconds
    // return () => clearInterval(interval)
  }, [socket]);

  function convertToPercentage(value: any, reference = 200) {
    const percentage = value / reference;
    return percentage;
  }

  return (
    <>
    <EditSensorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        initialData={data}
      />
      <CardWrapper>
        <div className="flex items-center justify-center p-6 bg-slate-200 rounded-md shadow-lg">
          <GaugeChart
            id="gauge-chart5"
            nrOfLevels={420}
            arcsLength={[0.2, 0.4, 0.3, 0.2]}
            colors={["#5BE12C", "#F5CD19", "#FFA500", "#EA4228"]}
            percent={percent}
            formatTextValue={value => value+''}
            arcPadding={0.02}
            textColor="5BE12C"
            needleColor="#345243"
            animate={false}
          />
        </div>
        <div className="flex items-center justify-between p-4 ">
          <h3 className="text-sm md:text-lg">{data.sensorName}</h3>
          <Button className="text-xs md:text-sm" onClick={() => setOpen(true)}>
            Settings
          </Button>
        </div>
      </CardWrapper>
    </>
  );
};
