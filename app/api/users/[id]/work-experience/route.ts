import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateWorkExperienceRequest } from '@/types';

// GET work experience records for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only view their own work experience records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only view your own work experience records' },
        { status: 403 }
      );
    }

    const workExperience = await prisma.workExperience.findMany({
      where: { userId: id },
      orderBy: [
        { endDate: 'desc' },
        { startDate: 'desc' }
      ]
    });

    return NextResponse.json(workExperience);
  } catch (error) {
    console.error('Error fetching work experience records:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new work experience record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only create work experience records for themselves
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only create work experience records for yourself' },
        { status: 403 }
      );
    }

    const data: CreateWorkExperienceRequest = await request.json();

    // Validate required fields
    if (!data.company || !data.position || !data.startDate) {
      return NextResponse.json(
        { message: 'Company, position, and start date are required' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid start date format' },
        { status: 400 }
      );
    }

    let endDate = null;
    if (data.endDate) {
      endDate = new Date(data.endDate);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { message: 'Invalid end date format' },
          { status: 400 }
        );
      }
      if (endDate < startDate) {
        return NextResponse.json(
          { message: 'End date cannot be before start date' },
          { status: 400 }
        );
      }
    }

    // Create work experience record
    const workExperience = await prisma.workExperience.create({
      data: {
        userId: id,
        company: data.company,
        position: data.position,
        startDate: startDate,
        endDate: endDate,
        description: data.description
      }
    });

    return NextResponse.json({
      message: 'Work experience record created successfully',
      workExperience
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating work experience record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update work experience record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only update their own work experience records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only update your own work experience records' },
        { status: 403 }
      );
    }

    const { workExperienceId, ...updateData } = await request.json();

    if (!workExperienceId) {
      return NextResponse.json(
        { message: 'Work experience ID is required' },
        { status: 400 }
      );
    }

    // Verify the work experience record belongs to the user
    const existingWorkExperience = await prisma.workExperience.findFirst({
      where: {
        id: workExperienceId,
        userId: id
      }
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { message: 'Work experience record not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const dataToUpdate: any = {
      ...updateData,
      updatedAt: new Date()
    };

    // Handle date conversions
    if (updateData.startDate !== undefined) {
      const startDate = new Date(updateData.startDate);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { message: 'Invalid start date format' },
          { status: 400 }
        );
      }
      dataToUpdate.startDate = startDate;
    }

    if (updateData.endDate !== undefined) {
      if (updateData.endDate) {
        const endDate = new Date(updateData.endDate);
        if (isNaN(endDate.getTime())) {
          return NextResponse.json(
            { message: 'Invalid end date format' },
            { status: 400 }
          );
        }
        dataToUpdate.endDate = endDate;
      } else {
        dataToUpdate.endDate = null;
      }
    }

    // Validate date logic if both dates are present
    if (dataToUpdate.startDate && dataToUpdate.endDate && dataToUpdate.endDate < dataToUpdate.startDate) {
      return NextResponse.json(
        { message: 'End date cannot be before start date' },
        { status: 400 }
      );
    }

    // Update work experience record
    const updatedWorkExperience = await prisma.workExperience.update({
      where: { id: workExperienceId },
      data: dataToUpdate
    });

    return NextResponse.json({
      message: 'Work experience record updated successfully',
      workExperience: updatedWorkExperience
    });
  } catch (error) {
    console.error('Error updating work experience record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE work experience record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only delete their own work experience records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only delete your own work experience records' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workExperienceId = searchParams.get('workExperienceId');

    if (!workExperienceId) {
      return NextResponse.json(
        { message: 'Work experience ID is required' },
        { status: 400 }
      );
    }

    // Verify the work experience record belongs to the user
    const existingWorkExperience = await prisma.workExperience.findFirst({
      where: {
        id: workExperienceId,
        userId: id
      }
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { message: 'Work experience record not found' },
        { status: 404 }
      );
    }

    // Delete work experience record
    await prisma.workExperience.delete({
      where: { id: workExperienceId }
    });

    return NextResponse.json({
      message: 'Work experience record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting work experience record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

