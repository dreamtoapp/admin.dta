import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateEducationRequest } from '@/types';

// GET education records for a user
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

    // Users can only view their own education records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only view your own education records' },
        { status: 403 }
      );
    }

    const education = await prisma.education.findMany({
      where: { userId: id },
      orderBy: [
        { endDate: 'desc' },
        { startDate: 'desc' }
      ]
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education records:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new education record
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

    // Users can only create education records for themselves
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only create education records for yourself' },
        { status: 403 }
      );
    }

    const data: CreateEducationRequest = await request.json();

    // Validate required fields
    if (!data.degree || !data.institution || !data.field || !data.startDate) {
      return NextResponse.json(
        { message: 'Degree, institution, field, and start date are required' },
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

    // Create education record
    const education = await prisma.education.create({
      data: {
        userId: id,
        degree: data.degree,
        institution: data.institution,
        field: data.field,
        startDate: startDate,
        endDate: endDate,
        gpa: data.gpa
      }
    });

    return NextResponse.json({
      message: 'Education record created successfully',
      education
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating education record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update education record
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

    // Users can only update their own education records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only update your own education records' },
        { status: 403 }
      );
    }

    const { educationId, ...updateData } = await request.json();

    if (!educationId) {
      return NextResponse.json(
        { message: 'Education ID is required' },
        { status: 400 }
      );
    }

    // Verify the education record belongs to the user
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: educationId,
        userId: id
      }
    });

    if (!existingEducation) {
      return NextResponse.json(
        { message: 'Education record not found' },
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

    // Update education record
    const updatedEducation = await prisma.education.update({
      where: { id: educationId },
      data: dataToUpdate
    });

    return NextResponse.json({
      message: 'Education record updated successfully',
      education: updatedEducation
    });
  } catch (error) {
    console.error('Error updating education record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE education record
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

    // Users can only delete their own education records
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only delete your own education records' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const educationId = searchParams.get('educationId');

    if (!educationId) {
      return NextResponse.json(
        { message: 'Education ID is required' },
        { status: 400 }
      );
    }

    // Verify the education record belongs to the user
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: educationId,
        userId: id
      }
    });

    if (!existingEducation) {
      return NextResponse.json(
        { message: 'Education record not found' },
        { status: 404 }
      );
    }

    // Delete education record
    await prisma.education.delete({
      where: { id: educationId }
    });

    return NextResponse.json({
      message: 'Education record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education record:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

