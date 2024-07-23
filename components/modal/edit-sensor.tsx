"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { EditSensorForm } from "../forms/edit-sensor-form";

interface EditSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  initialData:any | null
}

export const EditSensorModal: React.FC<EditSensorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData
}) => {
  const [isMounted, setIsMounted] = useState(false);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const initData = initialData
    ? {
        sensorId: initialData.id,
        sensorName: initialData.sensorName,
        location: initialData.location,
      }
    : null;
  return (
    <Modal
      title="Edit sensor"
      description="Edit your sensor here."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <EditSensorForm
            initialData={initData}
        />
        
      </div>
      
    </Modal>
  );
};
