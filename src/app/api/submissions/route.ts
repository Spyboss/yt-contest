import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { youtubeService } from '@/lib/services/youtube';
import { prisma } from "@/lib/prisma";

// Schema for video submission validation
const submissionSchema = z.object({
  youtubeUrl: z.string().url().refine((url) => {
    // YouTube URL validation
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return pattern.test(url);
  }, "Invalid YouTube URL"),
  title: z.string().min(3).max(100),
  description: z.string().optional(),
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string {
  const pattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);
  return match ? match[1] : "";
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const validatedData = submissionSchema.parse(body);

    // Extract video ID from URL
    const videoId = extractVideoId(validatedData.youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Check if video ID already exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { youtubeVideoId: videoId },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'This video has already been submitted' },
        { status: 409 }
      );
    }

    // Check monthly submission limit (max 3)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlySubmissions = await prisma.submission.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (monthlySubmissions >= 3) {
      return NextResponse.json(
        { error: 'Monthly submission limit reached (max 3)' },
        { status: 429 }
      );
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        youtubeVideoId: videoId,
        title: validatedData.title,
        description: validatedData.description,
        status: 'PENDING',
        verificationStatus: 'PENDING',
      },
    });

    // Initialize video metrics
    await prisma.videoMetrics.create({
      data: {
        submissionId: submission.id,
        views: 0,
        likes: 0,
        watchHours: 0,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all submissions for the current user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        metrics: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 