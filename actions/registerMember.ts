"use server"

import * as z from "zod";

import { db } from "@/lib/db";
import { MemberRegisterSchema } from "@/schemas";
import { getUserByUsername, getUserByName } from "@/data/user";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
export const registerMember = async (
  values: z.infer<typeof MemberRegisterSchema>
) => {
  const validatedFields = MemberRegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, username, phone, address, age, gender, id, idType, password, confirmPassword } = validatedFields.data;

  const existingUser = await getUserByUsername(username);
  const existingUser2 = await getUserByName(name);

  if (existingUser) {
    return { error: "Username already in use!" };
  }

  if (existingUser2) {
    return { error: "Name already in use!" };
  }

  if( password !== confirmPassword){
    return { error: "Password does not match" };
  } 

  const hashedPassword = await bcrypt.hash(password, 10);

  const dateNow = new Date()
  await db.user.create({
    data: {
      name,
      username,
      phone,
      address,
      emailVerified: dateNow.toISOString(),
      age,
      gender,
      role: UserRole.USER,
      password: hashedPassword
    },
  });

  return { success: "Registration Complete!" };
};

// Function to generate a unique user ID based on date
const generateUserId = () => {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = dateNow.getMonth() + 1;
  const day = dateNow.getDate();
  const roleCode = UserRole.ADMIN ? "A" : "M";

  // Combine date parts and role code to create a unique ID
  const userId = `${year}${month}${day}${roleCode}${Math.floor(Math.random() * 10000)}`;

  return userId;
};