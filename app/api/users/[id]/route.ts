import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateUserProfileRequest } from '@/types';
import { UserRole } from '@/constant/enums';

// GET user by ID with full HR profile data
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

    // Users can only view their own profile
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only view your own profile' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        directManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true
          }
        },
        subordinates: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { password: _omit, ...safeUser } = user as any;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user with comprehensive HR profile fields
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    console.log("PUT request received for user ID:", id);
    console.log("Session user ID:", session?.user?.id);
    console.log("Session user role:", session?.user?.role);

    if (!session?.user?.id) {
      console.log("No session found");
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only update their own profile, or admins can update any profile
    if (session.user.role !== UserRole.ADMIN && session.user.id !== id) {
      console.log("User ID mismatch:", session.user.id, "!=", id);
      return NextResponse.json(
        { message: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    // Check if request has a body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log("Invalid content type:", contentType);
      return NextResponse.json(
        { message: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Safely parse JSON with error handling
    let updateData: UpdateUserProfileRequest;
    try {
      const bodyText = await request.text();
      console.log("Raw request body:", bodyText);

      if (!bodyText || bodyText.trim() === '') {
        console.log("Empty request body");
        return NextResponse.json(
          { message: 'Request body cannot be empty' },
          { status: 400 }
        );
      }

      updateData = JSON.parse(bodyText);
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.log("Received update data:", updateData);

    // Validate that at least one field is provided for update
    const hasUpdates = Object.keys(updateData).some(key => updateData[key as keyof UpdateUserProfileRequest] !== undefined);
    console.log("Has updates:", hasUpdates);

    if (!hasUpdates) {
      console.log("No updates provided");
      return NextResponse.json(
        { message: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    // Prepare update data object
    const updateFields: any = {
      updatedAt: new Date()
    };

    // Personal Information (Staff editable)
    if (updateData.fullName !== undefined) updateFields.fullName = updateData.fullName;
    if (updateData.dateOfBirth !== undefined) updateFields.dateOfBirth = updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null;
    if (updateData.gender !== undefined) updateFields.gender = updateData.gender;
    if (updateData.maritalStatus !== undefined) updateFields.maritalStatus = updateData.maritalStatus;
    if (updateData.nationality !== undefined) updateFields.nationality = updateData.nationality;
    if (updateData.profileImage !== undefined) updateFields.profileImage = updateData.profileImage;

    // Contact Information (Staff editable)
    if (updateData.mobile !== undefined) updateFields.mobile = updateData.mobile;
    if (updateData.contactEmail !== undefined) updateFields.contactEmail = updateData.contactEmail;

    // Flattened Address (Staff editable)
    if (updateData.addressCity !== undefined) updateFields.addressCity = updateData.addressCity;
    if (updateData.addressCountry !== undefined) updateFields.addressCountry = updateData.addressCountry;

    // Coordinate validation and admin-only modification
    if (updateData.latitude !== undefined || updateData.longitude !== undefined) {
      // Check if user is trying to modify existing coordinates
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { latitude: true, longitude: true }
      });

      const hasExistingCoordinates = existingUser?.latitude && existingUser?.longitude;

      // If coordinates exist and user is not admin, prevent modification
      if (hasExistingCoordinates && session.user.role !== UserRole.ADMIN) {
        console.log("User attempted to modify existing coordinates without admin privileges");
        return NextResponse.json(
          { message: 'Coordinates are locked. Only administrators can modify existing coordinates.' },
          { status: 403 }
        );
      }

      // Validate new coordinates
      if (updateData.latitude !== undefined) {
        const lat = Number(updateData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return NextResponse.json(
            { message: 'Invalid latitude. Must be between -90 and 90.' },
            { status: 400 }
          );
        }
        updateFields.latitude = lat;
      }

      if (updateData.longitude !== undefined) {
        const lng = Number(updateData.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return NextResponse.json(
            { message: 'Invalid longitude. Must be between -180 and 180.' },
            { status: 400 }
          );
        }
        updateFields.longitude = lng;
      }
    }

    // Flattened Emergency Contact (Staff editable)
    if (updateData.emergencyContactName !== undefined) updateFields.emergencyContactName = updateData.emergencyContactName;
    if (updateData.emergencyContactPhone !== undefined) updateFields.emergencyContactPhone = updateData.emergencyContactPhone;
    if (updateData.emergencyContactRelationship !== undefined) updateFields.emergencyContactRelationship = updateData.emergencyContactRelationship;

    // Education & Skills (Staff editable) - SIMPLIFIED
    if (updateData.educationSummary !== undefined) updateFields.educationSummary = updateData.educationSummary;
    if (updateData.workExperienceSummary !== undefined) updateFields.workExperienceSummary = updateData.workExperienceSummary;
    if (updateData.englishProficiency !== undefined) updateFields.englishProficiency = updateData.englishProficiency;
    if (updateData.certifications !== undefined) updateFields.certifications = updateData.certifications;
    if (updateData.professionalDevelopment !== undefined) updateFields.professionalDevelopment = updateData.professionalDevelopment;

    // Official Documents (Staff editable)
    if (updateData.documentType !== undefined) updateFields.documentType = updateData.documentType;
    if (updateData.documentImage !== undefined) updateFields.documentImage = updateData.documentImage;

    // Employment Information (Admin only - check permissions)
    if (session.user.role === UserRole.ADMIN) {
      if (updateData.hireDate !== undefined) updateFields.hireDate = updateData.hireDate ? new Date(updateData.hireDate) : null;
      if (updateData.contractType !== undefined) updateFields.contractType = updateData.contractType;
      if (updateData.employmentStatus !== undefined) updateFields.employmentStatus = updateData.employmentStatus;
      if (updateData.noticePeriod !== undefined) updateFields.noticePeriod = updateData.noticePeriod;
      if (updateData.workSchedule !== undefined) updateFields.workSchedule = updateData.workSchedule;
      if (updateData.workLocation !== undefined) updateFields.workLocation = updateData.workLocation;
      if (updateData.directManagerId !== undefined) updateFields.directManagerId = updateData.directManagerId;
      if (updateData.jobTitle !== undefined) updateFields.jobTitle = updateData.jobTitle;
      if (updateData.jobLevel !== undefined) updateFields.jobLevel = updateData.jobLevel;
      if (updateData.basicSalary !== undefined) updateFields.basicSalary = updateData.basicSalary;
      if (updateData.bonus !== undefined) updateFields.bonus = updateData.bonus;
    }

    // Basic fields (always editable)
    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.email !== undefined) updateFields.email = updateData.email;

    // Update user
    console.log("Final update fields being sent to database:", updateFields);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateFields,
      include: {
        directManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true
          }
        },
        subordinates: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true
          }
        }
      }
    });

    console.log("Database update successful, updated user:", updatedUser);

    const { password: _omit, ...safeUser } = updatedUser as any;

    // Return the updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
