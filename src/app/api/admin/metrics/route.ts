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

    // Get time range from query params
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    // Calculate date range
    const now = new Date();
    const daysToSubtract = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }[range] || 7;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Get daily metrics
    const metrics = await prisma.videoMetrics.groupBy({
      by: ["lastUpdated"],
      _sum: {
        views: true,
        likes: true,
        watchHours: true,
      },
      where: {
        lastUpdated: {
          gte: startDate,
          lte: now,
        },
      },
    });

    // Get daily submission counts
    const submissions = await prisma.submission.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
    });

    // Combine and format the data
    const dateRange = getDatesInRange(startDate, now);
    const formattedData = dateRange.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const metric = metrics.find(
        (m) => m.lastUpdated.toISOString().split("T")[0] === dateStr
      );
      const submission = submissions.find(
        (s) => s.createdAt.toISOString().split("T")[0] === dateStr
      );

      return {
        date: dateStr,
        totalViews: metric?._sum.views || 0,
        totalLikes: metric?._sum.likes || 0,
        totalWatchHours: metric?._sum.watchHours || 0,
        submissions: submission?._count || 0,
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
} 