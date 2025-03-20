import { NextResponse, NextRequest } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import { prisma } from "@/lib/prisma";
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
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

    // Fetch all submissions with user info
    const submissions = await prisma.submission.findMany({
      select: {
        id: true,
        youtubeVideoId: true,
        title: true,
        status: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Admin submissions fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Check admin authorization
    const middlewareResponse = await adminMiddleware(req);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const url = new URL(req.url);
    const submissionId = url.pathname.split("/").pop();
    const { status } = await req.json();

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update submission status
    const submission = await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 