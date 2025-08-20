import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Admin-only task operations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');
    const assignee = searchParams.get('assignee');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause for admin view
    let whereClause: any = {};

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignee) whereClause.assignedTo = assignee;
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom);
      if (dateTo) whereClause.createdAt.lte = new Date(dateTo);
    }

    // Get tasks with full details for admin
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true
            }
          },
          assigner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          attachments: {
            select: {
              id: true,
              fileName: true,
              fileSize: true,
              fileType: true
            }
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.task.count({ where: whereClause })
    ]);

    // Get department statistics if department filter is applied
    let departmentStats = null;
    if (department) {
      departmentStats = await prisma.task.groupBy({
        by: ['status'],
        where: {
          assignee: {
            department: department
          }
        },
        _count: {
          id: true
        }
      });
    }

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      departmentStats
    });

  } catch (error) {
    console.error('Admin task listing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin tasks' },
      { status: 500 }
    );
  }
}

// Bulk task operations (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, taskIds, data } = await request.json();

    if (!action || !taskIds || !Array.isArray(taskIds)) {
      return NextResponse.json(
        { error: 'Invalid request: action and taskIds array required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'bulk_status_update':
        if (!data.status) {
          return NextResponse.json(
            { error: 'Status is required for bulk status update' },
            { status: 400 }
          );
        }

        result = await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: {
            status: data.status,
            completedAt: data.status === 'COMPLETED' ? new Date() : null
          }
        });

        // Create history entries for bulk update
        await Promise.all(
          taskIds.map(taskId =>
            prisma.taskHistory.create({
              data: {
                taskId,
                userId: session.user.id,
                action: 'Bulk Status Update',
                details: `Status changed to ${data.status} by admin`
              }
            })
          )
        );
        break;

      case 'bulk_reassign':
        if (!data.assignedTo) {
          return NextResponse.json(
            { error: 'assignedTo is required for bulk reassignment' },
            { status: 400 }
          );
        }

        // Verify new assignee exists
        const newAssignee = await prisma.user.findUnique({
          where: { id: data.assignedTo }
        });

        if (!newAssignee) {
          return NextResponse.json(
            { error: 'New assignee not found' },
            { status: 400 }
          );
        }

        result = await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { assignedTo: data.assignedTo }
        });

        // Create history entries for bulk reassignment
        await Promise.all(
          taskIds.map(taskId =>
            prisma.taskHistory.create({
              data: {
                taskId,
                userId: session.user.id,
                action: 'Bulk Reassignment',
                details: `Reassigned to ${newAssignee.name} by admin`
              }
            })
          )
        );
        break;

      case 'bulk_delete':
        result = await prisma.task.deleteMany({
          where: { id: { in: taskIds } }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      affectedTasks: result.count,
      message: `Successfully processed ${result.count} tasks`
    });

  } catch (error) {
    console.error('Bulk task operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}
