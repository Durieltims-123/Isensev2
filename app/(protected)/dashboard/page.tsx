"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Sensor, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { SmokeGauge } from "@/components/cards/smoke-gauge/smoke-gauge";
import { getLastReading, getSensorDataById } from "@/actions/sensor";
import { SensorCard } from "@/components/cards/sensorCard/sensorCard";
import { ContactsCard } from "@/components/cards/contacts/contacts-card";
import { BfpCard } from "@/components/cards/bfp/bfp-card";
import { MapsCard } from "@/components/cards/maps/maps-card";
import { UsersCard } from "@/components/cards/users/users-card";
import { AddSensorCard } from "@/components/cards/sensorCard/addSensor";
import { getAllSensorByUserId, getSensorById } from "@/data/sensor";
import { User } from "@prisma/client";
import { members } from "@/actions/admin";
import io from "socket.io-client";


const DashboardPage = () => {

  const { data: session, status } = useSession();

  const [sensorData, setSensorData] = useState<Sensor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mapCenter, setMapCenter] = useState({
    latitude: 16.41516667,
    longitude: 120.59559444,
  });


  const fetchUsers = async () => {
    const response = await members();
    if (response == null) {
      throw new Error("Failed to fetch data");
    }
    if ("error" in response) {
      console.error(response.error);
    } else {
      setUsers(response);
    }
  };
  const fetchSensorData = async () => {
    if (session) {
      const res = await getAllSensorByUserId(session!.user!.id!);
      if (res != null) {
        setSensorData(res);
      }
    }
  };

  useEffect(() => {
    if (session) {
      if (session!.user!.role! === UserRole.ADMIN) {
        fetchUsers();
      } else {
        fetchSensorData();
      }
    }
  }, [sensorData]);


  if (session) {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi{" "}
              {session!.user!.role! === UserRole.ADMIN
                ? "Admin!"
                : session!.user!.name!}
              , Welcome Back 👋
            </h2>
          </div>
          {session!.user!.role! === UserRole.ADMIN ? (
            <>
              <MapsCard data={users} center={mapCenter} />
              <UsersCard
                data={users}
                onLocate={(latitude, longitude) =>
                  setMapCenter({ latitude, longitude })
                }
              />
            </>
          ) : (
            // For Members
            <>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 h-auto">
                    <ContactsCard contactName="John Lee" />
                    <BfpCard />
                  </div>
                </TabsContent>
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center justify-between space-y-2 mt-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Available Sensors
                    </h2>
                  </div>
                  <div className="grid grid-cols-4 gap-4 h-auto">
                    {sensorData.map((sensor: Sensor, id: number) => (
                      <SensorCard key={id} data={sensor} />
                    ))}
                    <AddSensorCard data="love" />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </ScrollArea>
    );
  }
};
export default DashboardPage;
