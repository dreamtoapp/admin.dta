import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateLanguageRequest } from '@/types';

// GET languages for a user
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

    // Users can only view their own languages
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only view your own languages' },
        { status: 403 }
      );
    }

    const languages = await prisma.language.findMany({
      where: { userId: id },
      orderBy: [
        { proficiency: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new language
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

    // Users can only create languages for themselves
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only create languages for yourself' },
        { status: 403 }
      );
    }

    const data: CreateLanguageRequest = await request.json();

    // Validate required fields
    if (!data.language || !data.proficiency) {
      return NextResponse.json(
        { message: 'Language and proficiency are required' },
        { status: 400 }
      );
    }

    // Create language
    const language = await prisma.language.create({
      data: {
        userId: id,
        language: data.language,
        proficiency: data.proficiency,
        certified: data.certified ?? false
      }
    });

    return NextResponse.json({
      message: 'Language created successfully',
      language
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update language
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

    // Users can only update their own languages
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only update your own languages' },
        { status: 403 }
      );
    }

    const { languageId, ...updateData } = await request.json();

    if (!languageId) {
      return NextResponse.json(
        { message: 'Language ID is required' },
        { status: 400 }
      );
    }

    // Verify the language belongs to the user
    const existingLanguage = await prisma.language.findFirst({
      where: {
        id: languageId,
        userId: id
      }
    });

    if (!existingLanguage) {
      return NextResponse.json(
        { message: 'Language not found' },
        { status: 404 }
      );
    }

    // Update language
    const updatedLanguage = await prisma.language.update({
      where: { id: languageId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Language updated successfully',
      language: updatedLanguage
    });
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE language
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

    // Users can only delete their own languages
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only delete your own languages' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { message: 'Language ID is required' },
        { status: 400 }
      );
    }

    // Verify the language belongs to the user
    const existingLanguage = await prisma.language.findFirst({
      where: {
        id: languageId,
        userId: id
      }
    });

    if (!existingLanguage) {
      return NextResponse.json(
        { message: 'Language not found' },
        { status: 404 }
      );
    }

    // Delete language
    await prisma.language.delete({
      where: { id: languageId }
    });

    return NextResponse.json({
      message: 'Language deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting language:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

