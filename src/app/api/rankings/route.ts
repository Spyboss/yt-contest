import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface VideoMetrics {
  id: string;
  submissionId: string;
  views: number;
  likes: number;
  watchHours: number;
  lastUpdated: Date;
}

interface RankedSubmission {
  id: string;
  title: string;
  youtubeVideoId: string;
  userName: string | null;
  metrics: VideoMetrics | null;
  score: number;
  createdAt: Date;
}

type SubmissionWithRelations = {
  id: string;
  title: string;
  youtubeVideoId: string;
  createdAt: Date;
  user: {
    name: string | null;
  };
  metrics: VideoMetrics | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "month";
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "allTime") {
      startDate.setFullYear(2020); // Or any reasonable start date
    }

    const submissions = await prisma.submission.findMany({
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        metrics: true,
      },
      orderBy: [
        {
          metrics: {
            views: "desc",
          },
        },
        {
          metrics: {
            likes: "desc",
          },
        },
      ],
      take: 50, // Limit to top 50 submissions
    });

    // Calculate score and rank submissions
    const rankedSubmissions = submissions.map((submission: SubmissionWithRelations) => {
      // Score calculation: views + (likes * 10) + (watchHours * 100)
      const score =
        (submission.metrics?.views || 0) +
        (submission.metrics?.likes || 0) * 10 +
        (submission.metrics?.watchHours || 0) * 100;

      return {
        id: submission.id,
        title: submission.title,
        youtubeVideoId: submission.youtubeVideoId,
        userName: submission.user.name,
        metrics: submission.metrics,
        score,
        createdAt: submission.createdAt,
      };
    }).sort((a: RankedSubmission, b: RankedSubmission) => b.score - a.score);

    return NextResponse.json(rankedSubmissions);
  } catch (error) {
    console.error("Rankings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
} 