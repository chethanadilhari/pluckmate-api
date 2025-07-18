import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUser(email: string, password: string, role: UserRole, fullName: string, phone: string, address: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`User with email ${email} already exists. Skipping...`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          fullName,
          phone,
          address,
        },
      },
    },
  });

  console.log(`Seeded user: ${email}`);
}

async function main() {
  await seedUser(
    'chethanadilhari99@gmail.com',
    'chethana123',
    UserRole.OWNER,
    'Chethana Dilhari',
    '0771234567',
    'Kadugannawa'
  );

  await seedUser(
    'upul@pluckmate.com',
    'upul123',
    UserRole.SUPERINTENDENT,
    'Upul Fernando',
    '0779876543',
    'Gampola'
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
