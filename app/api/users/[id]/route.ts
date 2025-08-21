import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateUserProfileRequest } from '@/types';

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
        languages: true,
        education: true,
        workExperience: true,
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

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only update their own profile
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    const updateData: UpdateUserProfileRequest = await request.json();

    // Validate that at least one field is provided for update
    const hasUpdates = Object.keys(updateData).some(key => updateData[key as keyof UpdateUserProfileRequest] !== undefined);
    if (!hasUpdates) {
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
    if ((updateData as any).maritalStatus !== undefined) updateFields.maritalStatus = (updateData as any).maritalStatus;
    if (updateData.nationality !== undefined) updateFields.nationality = updateData.nationality;
    if (updateData.profileImage !== undefined) updateFields.profileImage = updateData.profileImage;

    // Contact Information (Staff editable)
    if (updateData.mobilePrimary !== undefined) updateFields.mobilePrimary = updateData.mobilePrimary;
    if (updateData.homePhone !== undefined) updateFields.homePhone = updateData.homePhone;
    if (updateData.workExtension !== undefined) updateFields.workExtension = updateData.workExtension;
    if (updateData.alternativeEmail !== undefined) updateFields.alternativeEmail = updateData.alternativeEmail;

    // Flattened Address (Staff editable)
    if ((updateData as any).addressStreet !== undefined) updateFields.addressStreet = (updateData as any).addressStreet;
    if ((updateData as any).addressCity !== undefined) updateFields.addressCity = (updateData as any).addressCity;
    if ((updateData as any).addressCountry !== undefined) updateFields.addressCountry = (updateData as any).addressCountry;

    // Flattened Emergency Contact (Staff editable)
    if ((updateData as any).emergencyContactName !== undefined) updateFields.emergencyContactName = (updateData as any).emergencyContactName;
    if ((updateData as any).emergencyContactPhone !== undefined) updateFields.emergencyContactPhone = (updateData as any).emergencyContactPhone;
    if ((updateData as any).emergencyContactRelationship !== undefined) updateFields.emergencyContactRelationship = (updateData as any).emergencyContactRelationship;

    // Education & Skills (Staff editable)
    if (updateData.educationLevel !== undefined) updateFields.educationLevel = updateData.educationLevel;
    if (updateData.fieldOfStudy !== undefined) updateFields.fieldOfStudy = updateData.fieldOfStudy;
    if ((updateData as any).institution !== undefined) updateFields.institution = (updateData as any).institution;
    if ((updateData as any).graduationYear !== undefined) updateFields.graduationYear = (updateData as any).graduationYear;
    if ((updateData as any).gpa !== undefined) updateFields.gpa = (updateData as any).gpa ? parseFloat((updateData as any).gpa) : null;
    if (updateData.generalSkills !== undefined) updateFields.generalSkills = updateData.generalSkills;
    if ((updateData as any).technicalSkills !== undefined) updateFields.technicalSkills = (updateData as any).technicalSkills;
    if ((updateData as any).softSkills !== undefined) updateFields.softSkills = (updateData as any).softSkills;
    if (updateData.generalExperience !== undefined) updateFields.generalExperience = updateData.generalExperience;
    if ((updateData as any).yearsOfExperience !== undefined) updateFields.yearsOfExperience = (updateData as any).yearsOfExperience;
    if ((updateData as any).specializations !== undefined) updateFields.specializations = (updateData as any).specializations;
    if ((updateData as any).englishProficiency !== undefined) updateFields.englishProficiency = (updateData as any).englishProficiency;
    if ((updateData as any).arabicProficiency !== undefined) updateFields.arabicProficiency = (updateData as any).arabicProficiency;
    if ((updateData as any).otherLanguages !== undefined) updateFields.otherLanguages = (updateData as any).otherLanguages;
    if ((updateData as any).certifications !== undefined) updateFields.certifications = (updateData as any).certifications;
    if ((updateData as any).professionalDevelopment !== undefined) updateFields.professionalDevelopment = (updateData as any).professionalDevelopment;

    // Official Documents (Staff editable)
    if (updateData.documentType !== undefined) updateFields.documentType = updateData.documentType;
    if (updateData.documentImage !== undefined) updateFields.documentImage = updateData.documentImage;

    // Employment Information (Admin only - check permissions)
    if (session.user.role === 'ADMIN') {
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
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateFields,
      include: {
        languages: true,
        education: true,
        workExperience: true,
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
