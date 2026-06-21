const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.adminUser.findMany();
  console.log('--- ADMIN USERS IN DATABASE ---');
  if (users.length === 0) {
    console.log('No admin users found in the database!');
  } else {
    users.forEach((u) => {
      console.log(`- ID: ${u.id}, Username: "${u.username}", Active: ${u.isActive}, Hash: "${u.passwordHash}"`);
    });
  }
  console.log('-------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error checking users:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
