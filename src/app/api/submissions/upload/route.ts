import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { youtubeService } from '@/lib/services/youtube';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit

const UploadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];

    // Validate metadata
    const metadata = UploadSchema.parse({
      title,
      description,
      tags,
    });

    // Validate file
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to YouTube
    const videoId = await youtubeService.uploadVideo(buffer, {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
    });

    // Wait for video processing and get initial metrics
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    const videoMetrics = await youtubeService.getVideoMetrics(videoId);

    // Create submission and initial metrics
    const newSubmission = await prisma.submission.create({
      data: {
        userId,
        youtubeVideoId: videoId,
        title: metadata.title,
        description: metadata.description,
        metrics: {
          create: {
            views: videoMetrics.views,
            likes: videoMetrics.likes,
            watchHours: videoMetrics.watchTimeMinutes / 60,
          },
        },
      },
      include: {
        metrics: true,
      },
    });

    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid upload data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 