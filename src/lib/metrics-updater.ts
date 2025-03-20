import { prisma } from "./prisma";
import { YouTubeService } from "./youtube";

interface SubmissionWithMetrics {
  id: string;
  youtubeVideoId: string;
  metrics: {
    id: string;
    submissionId: string;
    views: number;
    likes: number;
    watchHours: number;
    lastUpdated: Date;
  } | null;
}

export class MetricsUpdater {
  private static async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async updateAllMetrics() {
    try {
      // Get all approved submissions
      const submissions = await prisma.submission.findMany({
        where: {
          status: "APPROVED",
        },
        include: {
          metrics: true,
        },
      }) as SubmissionWithMetrics[];

      console.log(`Starting metrics update for ${submissions.length} videos...`);

      // Process submissions in batches to respect rate limits
      const batchSize = 50; // YouTube API quota considerations
      for (let i = 0; i < submissions.length; i += batchSize) {
        const batch = submissions.slice(i, i + batchSize);
        
        // Update metrics for current batch
        const updates = batch.map((submission: SubmissionWithMetrics) =>
          this.updateSubmissionMetrics(submission)
        );

        await Promise.allSettled(updates);

        // Check quota and add delay if needed
        const quota = await YouTubeService.getRateLimit();
        console.log(`Quota status: ${quota.quotaCost} units used out of ${quota.quotaLimit}`);

        if (i + batchSize < submissions.length) {
          // Add delay between batches
          await this.delay(2000); // 2 seconds between batches
        }
      }

      console.log("Metrics update completed");
    } catch (error) {
      console.error("Error updating metrics:", error);
      throw error;
    }
  }

  private static async updateSubmissionMetrics(
    submission: SubmissionWithMetrics
  ) {
    try {
      const metrics = await YouTubeService.getVideoMetrics(
        submission.youtubeVideoId
      );

      // Update metrics in database
      await prisma.videoMetrics.update({
        where: {
          submissionId: submission.id,
        },
        data: {
          views: metrics.views,
          likes: metrics.likes,
          watchHours: metrics.watchTimeMinutes / 60,
          lastUpdated: new Date(),
        },
      });

      console.log(
        `Updated metrics for video ${submission.youtubeVideoId}: Views=${metrics.views}, Likes=${metrics.likes}`
      );
    } catch (error) {
      console.error(
        `Error updating metrics for video ${submission.youtubeVideoId}:`,
        error
      );
    }
  }

  static async validateAndUpdateStatus() {
    try {
      // Get all submissions that need validation
      const submissions = await prisma.submission.findMany({
        where: {
          status: "PENDING",
        },
      });

      console.log(`Validating ${submissions.length} submissions...`);

      // Process validations in batches
      const batchSize = 50;
      for (let i = 0; i < submissions.length; i += batchSize) {
        const batch = submissions.slice(i, i + batchSize);

        for (const submission of batch) {
          try {
            const isValid = await YouTubeService.validateVideo(
              submission.youtubeVideoId
            );

            // Update submission status
            await prisma.submission.update({
              where: {
                id: submission.id,
              },
              data: {
                status: isValid ? "APPROVED" : "REJECTED",
                verificationStatus: isValid ? "APPROVED" : "REJECTED",
              },
            });

            console.log(
              `Validated submission ${submission.id}: ${
                isValid ? "Approved" : "Rejected"
              }`
            );
          } catch (error) {
            console.error(
              `Error validating submission ${submission.id}:`,
              error
            );
          }
        }

        if (i + batchSize < submissions.length) {
          // Add delay between batches
          await this.delay(2000);
        }
      }

      console.log("Validation completed");
    } catch (error) {
      console.error("Error during validation:", error);
      throw error;
    }
  }
} 