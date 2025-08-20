import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Test endpoint to check if session is working
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    return NextResponse.json({
      message: 'Session test',
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      requestedId: id,
      sessionKeys: session ? Object.keys(session) : [],
      userKeys: session?.user ? Object.keys(session.user) : []
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Session test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Debug request headers
    console.log('=== REQUEST DEBUG ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Request cookies:', request.headers.get('cookie'));
    console.log('========================');

    // Get session using NextAuth v5 auth() function
    const session = await auth();

    // Debug logging
    console.log('=== API ROUTE DEBUG ===');
    console.log('Requested user ID:', id);
    console.log('Session exists:', !!session);
    console.log('Session user exists:', !!session?.user);
    console.log('Session user ID:', session?.user?.id);
    console.log('Session user email:', session?.user?.email);
    console.log('Session keys:', session ? Object.keys(session) : 'No session');
    console.log('User keys:', session?.user ? Object.keys(session.user) : 'No user');
    console.log('========================');

    // Check if user is authenticated
    if (!session?.user?.id) {
      console.log('No session or user ID found in API route');
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Users can only change their own password
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only change your own password' },
        { status: 403 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get user and verify current password
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'User not found or no password set' },
        { status: 404 }
      );
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password
    await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
}
