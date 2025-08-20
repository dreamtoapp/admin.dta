import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Create new task (STAFF and ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, priority, type, assignedTo, dueDate } = await request.json();

    // Validate required fields
    if (!title || !assignedTo) {
      return NextResponse.json(
        { error: 'Title and assignedTo are required' },
        { status: 400 }
      );
    }

    // Verify assigned user exists
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedTo }
    });

    if (!assignedUser) {
      return NextResponse.json(
        { error: 'Assigned user not found' },
        { status: 400 }
      );
    }

    // Create task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        type: type || 'GENERAL',
        assignedTo,
        assignedBy: session.user.id,
        dueDate: dueDate ? new Date(dueDate) : null
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
        taskId: newTask.id,
        userId: session.user.id,
        action: 'Task Created',
        details: `Task "${title}" created and assigned to ${assignedUser.name}`
      }
    });

    return NextResponse.json({
      success: true,
      task: newTask
    });

  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// List tasks with role-based filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    let whereClause: any = {};

    if (session.user.role === 'CLIENT') {
      // Clients can only see tasks assigned to them
      whereClause.assignedTo = session.user.id;
    } else if (session.user.role === 'STAFF') {
      // Staff can see tasks assigned to them or by them
      whereClause.OR = [
        { assignedTo: session.user.id },
        { assignedBy: session.user.id }
      ];
    }
    // Admins can see all tasks (no additional filtering)

    // Add filters
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignedTo) whereClause.assignedTo = assignedTo;

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.task.count({ where: whereClause })
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Task listing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
