import { NextResponse } from "next/server";
import { MetricsUpdater } from "@/lib/metrics-updater";

// Verify cron job secret
const verifyCronSecret = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!authHeader || !expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return false;
  }

  return true;
};

export async function POST(req: Request) {
  try {
    // Verify the request is from our cron job
    if (!verifyCronSecret(req)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First validate any pending submissions
    await MetricsUpdater.validateAndUpdateStatus();

    // Then update metrics for all approved submissions
    await MetricsUpdater.updateAllMetrics();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 