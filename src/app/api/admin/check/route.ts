import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.json({ role: 'ADMIN' });
  } catch (error) {
    console.error('Admin check error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 