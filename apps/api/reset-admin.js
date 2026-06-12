const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const plainPassword = '1';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hashedPassword, isActive: true },
    create: {
      username,
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });

  console.log(`✅ Successfully reset password of administrative user "${username}" to "${plainPassword}".`);
}

main()
  .catch((e) => {
    console.error('❌ Error resetting admin password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
