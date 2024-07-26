"use server";

import { PrismaClient, Sensor, LastReading } from "@prisma/client";
const prisma = new PrismaClient();

export const getSensorById = async (id: string): Promise<Sensor | null> => {
  try {
    const sensor = await prisma.sensor.findUnique({
      where: { id: id },
    });
    return sensor;
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    return null;
  }
};

export const getAllSensorByUserId = async (
  id: string
): Promise<Sensor[] | null> => {
  try {
    const sensor = await prisma.sensor.findMany({
      where: { userId: id },
    });
    return sensor;
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    return null;
  }
};

export const getAllSensors = async (): Promise<Sensor[] | null> => {
  try {
    const sensor = await prisma.sensor.findMany();
    return sensor;
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    return null;
  }
};

// export const createSensor = async (
//   sensorName: string
// ): Promise<Sensor | null> => {
//   try {
//     const newSensor = await prisma.sensor.create({
//       data: { sensorName },
//     });

//     const initialLastReading = await prisma.lastReading.create({
//       data: {
//         gasConcentration: 0,
//         sensorId: newSensor.id,
//       },
//     });

//     const updatedSensor = await prisma.sensor.update({
//       where: { id: newSensor.id },
//       data: {
//         lastReadingId: initialLastReading.id,
//       },
//     });

//     return updatedSensor;
//   } catch (error) {
//     console.error("Error creating sensor:", error);
//     return null;
//   }
// };

export const updateSensor = async (
  id: string,
  sensorData: Partial<Sensor>
): Promise<Sensor | null> => {
  try {
    const updatedSensor = await prisma.sensor.update({
      where: { id },
      data: sensorData,
    });
    return updatedSensor;
  } catch (error) {
    console.error("Error updating sensor:", error);
    return null;
  }
};

export const deleteSensorById = async (
  id: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const sensorToDelete = await prisma.sensor.findUnique({ where: { id } });
    if (!sensorToDelete) {
      throw new Error("Sensor not found");
    }

    await prisma.sensor.delete({ where: { id } });

    return { success: "Sensor deleted successfully" };
  } catch (error) {
    console.error("Error deleting sensor:", error);
    return {
      error: error instanceof Error ? error.message : "Error deleting sensor",
    };
  }
};
export const updateLastReading = async (
  id: string,
  lastReadingData: Partial<LastReading>
) => {
  try {
    const lastReading = await prisma.lastReading.update({
      where: {
        sensorId: id,
      },
      data: {
        smokeConcentration: lastReadingData.smokeConcentration,
      },
    });
    return lastReading;
  } catch (error) {
    console.error(error);
    return null;
  }
};
