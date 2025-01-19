"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserDetails = async (userId) => {
  try {
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userDetails) {
      throw new Error("User not found");
    }
    
    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};