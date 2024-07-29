"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { EditSensorForm } from "../forms/edit-sensor-form";
import { SensorCard } from "../cards/sensorCard/sensorCard";
import { Sensor } from "@prisma/client";

interface AdminSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  initialData: any | null;
}

export const AdminSensorModal: React.FC<AdminSensorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const newInitData = initialData ? [initialData] : [];
  return (
    <Modal
      title="Edit sensor"
      description="Edit your sensor here."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid grid-cols-4 gap-4 h-auto">
        {newInitData.length > 0 ? (
          newInitData.map((sensor: Sensor, id: number) => (
            <SensorCard key={id} data={sensor} />
          ))
        ) : (
          <p>No sensors available.</p>
        )}
      </div>
    </Modal>
  );
};
