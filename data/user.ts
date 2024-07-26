import { PrismaClient, User, LastReading, UserRole } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    return user;
  } catch {
    return null;
  }
};

export const getUserByName = async (name: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { name } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const User = await prisma.user.findUnique({ where: { id } });
    return User;
  } catch (error) {
    console.error("Error fetching User by ID:", error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[] | null> => {
  try {
    const User = await prisma.user.findMany();
    return User;
  } catch (error) {
    console.error("Error fetching User by ID:", error);
    return null;
  }
};

export const getAllMembers = async (): Promise<User[] | null> => {
  try {
    const users = await prisma.user.findMany({ where: { role: "USER" } });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const createUser = async (UserData: User): Promise<User | null> => {
  try {
    const newUser = await prisma.user.create({ data: UserData });
    return newUser;
  } catch (error) {
    console.error("Error creating User:", error);
    return null;
  }
};

export const updateUser = async (
  id: string,
  UserData: Partial<User>
): Promise<User | null> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: UserData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating User:", error);
    return null;
  }
};

export const deleteUserById = async (
  id: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const UserToDelete = await prisma.user.findUnique({ where: { id } });
    if (!UserToDelete) {
      throw new Error("User not found");
    }

    await prisma.user.delete({ where: { id } });

    return { success: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting User:", error);
    return {
      error: error instanceof Error ? error.message : "Error deleting User",
    };
  }
};
