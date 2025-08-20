import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Assign or reassign a task
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { assignedTo, reason } = await request.json();

    if (!assignedTo) {
      return NextResponse.json(
        { error: 'assignedTo is required' },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user can reassign this task
    if (session.user.role === 'STAFF' &&
      task.assignedTo !== session.user.id &&
      task.assignedBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify new assignee exists
    const newAssignee = await prisma.user.findUnique({
      where: { id: assignedTo }
    });

    if (!newAssignee) {
      return NextResponse.json(
        { error: 'New assignee not found' },
        { status: 400 }
      );
    }

    // Don't allow reassigning to the same person
    if (task.assignedTo === assignedTo) {
      return NextResponse.json(
        { error: 'Task is already assigned to this user' },
        { status: 400 }
      );
    }

    const oldAssigneeName = task.assignee.name;
    const newAssigneeName = newAssignee.name;

    // Update task assignment
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        assignedTo,
        // Reset status to PENDING when reassigning
        status: 'PENDING',
        completedAt: null
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        assigner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create task history entry
    await prisma.taskHistory.create({
      data: {
        taskId: id,
        userId: session.user.id,
        action: 'Task Reassigned',
        oldValue: oldAssigneeName,
        newValue: newAssigneeName,
        details: reason || `Task reassigned from ${oldAssigneeName} to ${newAssigneeName}`
      }
    });

    // Create notification for new assignee
    await prisma.taskNotification.create({
      data: {
        taskId: id,
        type: 'ASSIGNMENT',
        message: `You have been assigned to task: "${task.title}"`,
        recipientId: assignedTo,
        senderId: session.user.id
      }
    });

    // TODO: Send email notification to new assignee
    // if (newAssignee.email) {
    //   await sendAssignmentEmail(newAssignee.email, task, session.user.name);
    // }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: `Task successfully reassigned from ${oldAssigneeName} to ${newAssigneeName}`
    });

  } catch (error) {
    console.error('Task assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to reassign task' },
      { status: 500 }
    );
  }
}

// Get assignment history for a task
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

    // Verify task exists
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

    // Get assignment history
    const assignmentHistory = await prisma.taskHistory.findMany({
      where: {
        taskId: id,
        action: { in: ['Task Created', 'Task Reassigned'] }
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ assignmentHistory });

  } catch (error) {
    console.error('Assignment history fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment history' },
      { status: 500 }
    );
  }
}
