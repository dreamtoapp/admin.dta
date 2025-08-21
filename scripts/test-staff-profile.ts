import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Testing database connection...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check if we have any users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    // Check existing users and their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        department: true
      }
    });

    console.log('👥 Existing users:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.fullName || 'No name'} - ${user.department || 'No dept'}`);
    });

    // Create a test STAFF user if none exists
    const staffUser = await prisma.user.findFirst({
      where: { role: 'STAFF' }
    });

    if (!staffUser) {
      console.log('👷 Creating test STAFF user...');
      const newStaffUser = await prisma.user.create({
        data: {
          email: 'staff@test.com',
          password: 'test123', // Simple password for testing
          role: 'STAFF',
          fullName: 'Test Staff Member',
          department: 'Development',
          isActive: true,
          mobile: '+1234567890',
          contactEmail: 'staff@test.com',
          addressStreet: '123 Test Street',
          addressCity: 'Test City',
          addressCountry: 'Test Country',
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '+0987654321',
          emergencyContactRelationship: 'Spouse'
        }
      });
      console.log('✅ Created test STAFF user:', newStaffUser.email);
    } else {
      console.log('✅ STAFF user already exists:', staffUser.email);
    }

    // Test updating a user profile
    const testUser = await prisma.user.findFirst({
      where: { role: 'STAFF' }
    });

    if (testUser) {
      console.log('🔄 Testing profile update...');
      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: {
          fullName: 'Updated Test Staff Member',
          mobile: '+1111111111',
          updatedAt: new Date()
        }
      });
      console.log('✅ Profile update successful:', updatedUser.fullName);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

main();
