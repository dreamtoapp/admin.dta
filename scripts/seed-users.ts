import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting user seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dreamtoapp.com' },
    update: {},
    create: {
      email: 'admin@dreamtoapp.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
      department: 'Management'
    }
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create sample staff member
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@dreamtoapp.com' },
    update: {},
    create: {
      email: 'staff@dreamtoapp.com',
      password: 'staff123',
      name: 'John Doe',
      role: 'STAFF',
      department: 'Development'
    }
  });
  console.log('✅ Staff user created:', staffUser.email);

  // Create sample client
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@dreamtoapp.com' },
    update: {},
    create: {
      email: 'client@dreamtoapp.com',
      password: 'client123',
      name: 'Jane Smith',
      role: 'CLIENT',
      department: 'Client Services'
    }
  });
  console.log('✅ Client user created:', clientUser.email);

  // Create additional staff members for testing
  const additionalStaff = await prisma.user.upsert({
    where: { email: 'developer@dreamtoapp.com' },
    update: {},
    create: {
      email: 'developer@dreamtoapp.com',
      password: 'dev123',
      name: 'Ahmed Developer',
      role: 'STAFF',
      department: 'Development'
    }
  });
  console.log('✅ Additional staff created:', additionalStaff.email);

  console.log('🎉 User seeding completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@dreamtoapp.com / admin123');
  console.log('Staff: staff@dreamtoapp.com / staff123');
  console.log('Client: client@dreamtoapp.com / client123');
  console.log('Developer: developer@dreamtoapp.com / dev123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
