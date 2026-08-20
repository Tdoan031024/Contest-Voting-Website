const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'Startup.Huitmedia';
  const plainPassword = 'Huit@media2019';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingTarget = await prisma.adminUser.findUnique({ where: { username } });
  const legacyAdmin = await prisma.adminUser.findUnique({ where: { username: 'admin' } });

  if (existingTarget) {
    await prisma.adminUser.update({
      where: { username },
      data: { passwordHash: hashedPassword, isActive: true, role: 'admin' },
    });

    if (legacyAdmin && legacyAdmin.id !== existingTarget.id) {
      await prisma.adminUser.update({
        where: { username: 'admin' },
        data: { isActive: false },
      });
    }
  } else if (legacyAdmin) {
    await prisma.adminUser.update({
      where: { username: 'admin' },
      data: {
        username,
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });
  } else {
    await prisma.adminUser.create({
      data: {
      username,
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
      },
    });
  }

  await prisma.adminUser.updateMany({
    where: {
      username: { in: ['admin', 'Huitmedia'] },
    },
    data: { isActive: false },
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
