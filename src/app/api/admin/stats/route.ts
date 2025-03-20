import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Check admin authorization
    const middlewareResponse = await adminMiddleware(req);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    // Get dashboard stats
    const [totalUsers, totalSubmissions, pendingSubmissions] = await Promise.all([
      prisma.user.count(),
      prisma.submission.count(),
      prisma.submission.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalSubmissions,
      pendingSubmissions,
      activeContests: 1, // Hardcoded for now, can be made dynamic if needed
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 