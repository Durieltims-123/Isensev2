"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // await signOut();
  await signOut({ redirectTo: "/auth/login" });
};
