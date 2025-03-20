import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the requesting user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update submission status to REJECTED
    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: { status: 'REJECTED' }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Submission rejection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 