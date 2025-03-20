#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.error(`No user found with email ${email}`);
      return null;
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`Successfully made ${email} an admin!`);
    return user;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error("Please provide an email address");
  process.exit(1);
}

makeAdmin(email)
  .then((user) => {
    if (user) process.exit(0);
    else process.exit(1);
  })
  .catch(() => process.exit(1)); 