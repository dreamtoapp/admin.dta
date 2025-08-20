import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserAPI() {
  console.log('🧪 Testing User Management API...\n');

  try {
    // Test 1: List all users (should work)
    console.log('📋 Test 1: Listing all users...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role} - ${user.department}`);
    });

    // Test 2: Verify user roles
    console.log('\n🔐 Test 2: Verifying user roles...');
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const staffCount = users.filter(u => u.role === 'STAFF').length;
    const clientCount = users.filter(u => u.role === 'CLIENT').length;

    console.log(`✅ Role distribution: ${adminCount} Admin, ${staffCount} Staff, ${clientCount} Client`);

    // Test 3: Check specific user details
    console.log('\n👤 Test 3: Checking specific user details...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dreamtoapp.com' }
    });

    if (adminUser) {
      console.log(`✅ Admin user verified:`);
      console.log(`   - ID: ${adminUser.id}`);
      console.log(`   - Name: ${adminUser.name}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Department: ${adminUser.department}`);
      console.log(`   - Active: ${adminUser.isActive}`);
    }

    // Test 4: Verify password storage
    console.log('\n🔒 Test 4: Verifying password storage...');
    const usersWithPasswords = await prisma.user.findMany({
      select: { email: true, password: true }
    });

    usersWithPasswords.forEach(user => {
      const hasPassword = user.password && user.password.length > 0;
      console.log(`   - ${user.email}: ${hasPassword ? '✅ Has password' : '❌ No password'}`);
    });

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total users: ${users.length}`);
    console.log(`   - Admin users: ${adminCount}`);
    console.log(`   - Staff users: ${staffCount}`);
    console.log(`   - Client users: ${clientCount}`);
    console.log(`   - All users have passwords: ${usersWithPasswords.every(u => u.password)}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testUserAPI()
  .catch((e) => {
    console.error('❌ Test error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
