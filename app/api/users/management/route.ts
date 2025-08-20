import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET available managers for profile assignment
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // Filter by role (ADMIN, STAFF, or ALL)
    const search = searchParams.get('search'); // Search by name, email, or job title
    const limit = parseInt(searchParams.get('limit') || '50');
    const excludeId = searchParams.get('excludeId'); // Exclude current user

    // Build where clause
    const whereClause: any = {
      isActive: true,
      id: { not: excludeId } // Exclude current user
    };

    // Filter by role if specified
    if (role && role !== 'ALL') {
      whereClause.role = role;
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }

    const managers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        jobTitle: true,
        jobLevel: true,
        profileImage: true,
        isActive: true
      },
      orderBy: [
        { role: 'asc' }, // Admins first, then staff
        { name: 'asc' }  // Then alphabetically by name
      ],
      take: limit
    });

    return NextResponse.json({
      managers,
      total: managers.length,
      filters: { role, search, limit, excludeId }
    });
  } catch (error) {
    console.error('Error fetching managers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
