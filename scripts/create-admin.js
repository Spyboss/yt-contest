const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin(email, name, clerkUserId) {
  try {
    const user = await prisma.user.create({
      data: {
        id: clerkUserId,
        email,
        name,
        role: 'ADMIN',
      },
    });
    console.log('Successfully created admin user:', user);
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get arguments from command line
const [email, name, clerkUserId] = process.argv.slice(2);

if (!email || !name || !clerkUserId) {
  console.error('Please provide email, name, and Clerk user ID');
  console.error('Usage: node create-admin.js "email" "name" "clerk_user_id"');
  process.exit(1);
}

createAdmin(email, name, clerkUserId)
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 