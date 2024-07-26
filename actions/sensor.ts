"use server";
import * as z from "zod";
import { getSensorById, getAllSensorByUserId } from "@/data/sensor";
import { db } from "@/lib/db";
import { SensorSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
export const getLastReading = async (id: string) => {
  const fetchData = await getSensorById(id);

  if (fetchData == null) {
    return { error: "No Result" };
  }
  try {
    const sensorReading = await db.lastReading.findUnique({
      where: { id: fetchData.lastReadingId! },
      select: {
        smokeConcentration: true,
      },
    });
    revalidatePath(`/dashboard`)
    return sensorReading;
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    return null;
  }
};

export const getSensorDataById = async (id: string) => {
  try {
    const fetchData = await getSensorById(id);
    if (fetchData == null) {
      return { error: "No Result" };
    }
    return fetchData;
  } catch (error) {
    return { error: "User not found or missing ID!" };
  }
};

export const getAllSensorData = async (id: string) => {
  try {
    const fetchData = await getAllSensorByUserId(id);
    if (fetchData == null) {
      return { error: "No Result" };
    }
    return fetchData;
  } catch (error) {
    return { error: "User not found or missing ID!" };
  }
};

export const createSensorData = async (
  values: z.infer<typeof SensorSchema>
) => {
  const validatedFields = SensorSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { sensorName, location, sensorId } = validatedFields.data;
  const currentUserData  = await currentUser();
  const fetchData = await getSensorById(sensorId);

  
  if (!currentUserData || !currentUserData.id) {
    return { error: "User not found or missing ID!" };
  }

  if (fetchData !== null) {
    return { error: "Sensor already registered to another account" };
  }

  const userId = currentUserData.id;
  try {
    const newSensor = await db.sensor.create({
      data: { id:sensorId, sensorName, location, registered: true, active:false, userId: userId },
    });

    const initialLastReading = await db.lastReading.create({
      data: {
        smokeConcentration: 0,
        lpg: 0,
        co:0,
        sensorId: newSensor.id,
      },
    });

    await db.sensor.update({
      where: { id: newSensor.id },
      data: {
        lastReadingId: initialLastReading.id,
      },
    });

    return { success: "Sensor created successfully" };
  } catch (error) {
    console.error("Error creating sensor:", error);
    return { error: "There is an error in your input, Please try again" };
  }
};


export const deleteSensor = async ( sensorId:string) => {
  const currentUserData = await currentUser();

  if (!currentUserData || !currentUserData.id) {
    return { error: "User not found or missing ID!" };
  }
  
  const fetchData = await getSensorById(sensorId);

  if (fetchData === null) {
    return { error: "Sensor not found!" };
  }

  if (fetchData.userId !== currentUserData.id) {
    if(currentUserData.role !== "ADMIN"){
      return { error: "You do not have permission to delete this sensor!" };
    }
  }

  try {
    await db.lastReading.deleteMany({
      where: { sensorId: sensorId },
    });
    await db.sensor.delete({
      where: { id: sensorId },
    });


    return { success: "Sensor deleted successfully" };
  } catch (error) {
    console.error("Error deleting sensor:", error);
    return { error: "There was an error deleting the sensor. Please try again" };
  }
};

export const updateSensor = async (
  values: Partial<z.infer<typeof SensorSchema>>
) => {
  const validatedFields = SensorSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { sensorName, location, sensorId } = validatedFields.data;
 
  const currentUserData = await currentUser();

  if (!currentUserData || !currentUserData.id) {
    return { error: "User not found or missing ID!" };
  }

  const fetchData = await getSensorById(sensorId);

  if (fetchData === null) {
    return { error: "Sensor not found!" };
  }

  if (fetchData.userId !== currentUserData.id) {
    return { error: "You do not have permission to update this sensor!" };
  }

  try {
    const updatedSensor = await db.sensor.update({
      where: { id: sensorId },
      data: {
        sensorName:sensorName,
        location: location
      },
    });

    return { success: "Sensor updated successfully", sensor: updatedSensor };
  } catch (error) {
    console.error("Error updating sensor:", error);
    return { error: "There was an error updating the sensor. Please try again" };
  }
};