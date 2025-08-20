import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Send notification for task status change
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, message, recipientId } = await request.json();

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        assigner: { select: { id: true, name: true, email: true } }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === 'CLIENT' && task.assignedTo !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (session.user.role === 'STAFF' &&
      task.assignedTo !== session.user.id &&
      task.assignedBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create notification record
    const notification = await prisma.taskNotification.create({
      data: {
        taskId: id,
        type: type || 'STATUS_CHANGE',
        message: message || 'Task status has been updated',
        recipientId: recipientId || task.assignee.id,
        senderId: session.user.id,
        isRead: false
      }
    });

    // TODO: Send email notification if configured
    // This would integrate with your email service (Resend, etc.)
    if (type === 'STATUS_CHANGE' && task.assignee.email) {
      // await sendEmailNotification(task.assignee.email, message, task);
    }

    // TODO: Send in-app notification
    // This would integrate with a real-time notification system

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Notification creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// Get notifications for a task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === 'CLIENT' && task.assignedTo !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (session.user.role === 'STAFF' &&
      task.assignedTo !== session.user.id &&
      task.assignedBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get notifications for this task
    const notifications = await prisma.taskNotification.findMany({
      where: { taskId: id },
      include: {
        recipient: { select: { id: true, name: true, email: true } },
        sender: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ notifications });

  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
