import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/prisma';
import { uploadVoiceToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Schema for validating consultation request input
 */
const ConsultationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * POST /api/consultation
 * Handles free consultation requests from the floating CTA, including optional voice upload
 *
 * @param req - Next.js API request
 * @returns JSON response with success or error message
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string;
    const voiceFile = formData.get('voice') as File | null;

    // Validate fields
    const parsed = ConsultationSchema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    let voiceUrl: string | undefined = undefined;
    if (voiceFile) {
      console.log('Received voice file:', voiceFile);
      if (!['audio/webm', 'audio/mp3', 'audio/mpeg'].includes(voiceFile.type)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid audio file type.'
        }, { status: 400 });
      }
      if (voiceFile.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json({
          success: false,
          message: 'Audio file is too large.'
        }, { status: 400 });
      }
      const arrayBuffer = await voiceFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      voiceUrl = await uploadVoiceToCloudinary(buffer, `consultation-${Date.now()}`);
      console.log('Cloudinary returned voiceUrl:', voiceUrl);
    }

    const dataToSave = {
      name,
      email,
      phone: phone || undefined,
      message,
      voiceUrl,
    };
    console.log('Saving to DB:', dataToSave);
    await db.consultationRequest.create({
      data: dataToSave,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error for security monitoring
    console.error('Consultation request error:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 });
  }
} 