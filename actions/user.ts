"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { UpdateSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/data/user";
import { UserRole } from "@prisma/client";

export const updateUser = async (values: z.infer<typeof UpdateSchema>) => {
  const validatedFields = UpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    username,
    password,
    name,
    lat,
    lng,
    address,
    confirmPassword,
    phone,
    imgUrl
  } = validatedFields.data;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    if(username != existingUser.username){
        return { error: "Username already in use!" };
    }
  }

  if (password !== confirmPassword) {
    return { error: "Password does not match" };
  }
  const dateNow = new Date();

  // Create a new document with the incremented idNo value
  await db.user.update({
    where: { username }, 
    data: {
      name,
      username,
      address,
      phone,
      latitude: lat,
      longitude: lng,
      imgUrl: imgUrl[0].fileUrl,
      password: hashedPassword,
      emailVerified: dateNow.toISOString(),
      role: UserRole.USER,
    },
  });

  return { success: "Update Complete!" };
};
