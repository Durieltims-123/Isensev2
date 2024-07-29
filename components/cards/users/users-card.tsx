"use client";

import { CardWrapper } from "@/components/cards/users/card-wrapper";
import { AdminSensorModal } from "@/components/modal/admin-sensor-modal";
import { EditSensorModal } from "@/components/modal/edit-sensor";
import { Button } from "@/components/ui/button";
import { Sensor, User } from "@prisma/client";

import Image from "next/image";
import { useState } from "react";

interface UsersCardProps {
  data: User[];
  onLocate: (latitude: number, longitude: number) => void;
  sensorDatax: Sensor[];
}

export const UsersCard: React.FC<UsersCardProps> = ({ data, onLocate, sensorDatax }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sensorCard, setSensorCard] = useState<Sensor | null>(null);

  const onConfirm = async () => {};
  const onChooseCard = (sensorDatax: Sensor[], userId: string) => {
    const userSensorData = sensorDatax.find(sensor => sensor.userId === userId) || null;
    setSensorCard(userSensorData);
    setOpen(true);
  };
  const defaultImgUrl = "https://utfs.io/f/612cf32a-4729-4649-b638-074983d0f3f7-1zbfv.png";
  
  return (
    <>
      <AdminSensorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        initialData={sensorCard}
      />
      <CardWrapper headerLabel="Users">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-bold text-2xl">Users</h3>
        </div>
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-3">
          <div className="col-span-1 font-semibold">Avatar</div>
          <div className="col-span-1 font-semibold">Name</div>
          <div className="col-span-1 font-semibold">Address</div>
          <div className="col-span-1 font-semibold">Phone</div>
          <div className="col-span-1 font-semibold">Actions</div>
        </div>
        {/* Content */}
        {data.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-5 gap-4 items-center py-1 px-3"
          >
            <div className="col-span-1 flex items-center">
              <Image
                width={30}
                height={30}
                alt="User avatar"
                src={user.imgUrl??defaultImgUrl}
              />
            </div>
            <div className="col-span-1">
              <p className="text-md">{user.name}</p>
            </div>
            <div className="col-span-1">
              <p className="text-md">{user.address}</p>
            </div>
            <div className="col-span-1">
              <p className="text-md">{user.phone}</p>
            </div>

            <div className="col-span-1 ">
              <Button
                className="rounded-2xl mr-4"
                onClick={()=> onChooseCard(sensorDatax, user.id)}
              >
                <p className="text-white px-2">Sensor</p>
              </Button>
              <Button
                className="rounded-2xl"
                onClick={() => onLocate(user.latitude!, user.longitude!)}
              >
                <p className="text-white px-2">Edit</p>
              </Button>
            </div>
          </div>
        ))}
      </CardWrapper>
    </>
  );
};
