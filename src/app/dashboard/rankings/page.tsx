"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface VideoMetrics {
  views: number;
  likes: number;
  watchHours: number;
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

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankedSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "allTime">("month");

  useEffect(() => {
    fetchRankings();
  }, [period]);

  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rankings?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rankings");
      }
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      toast.error("Failed to load rankings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Contest Rankings</h1>
          <p className="mt-2 text-sm text-gray-600">
            View the top performing videos in the contest.
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <div className="flex space-x-4">
            {["week", "month", "allTime"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as typeof period)}
                className={`px-4 py-2 rounded-md ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {p === "allTime" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No submissions yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Be the first to submit a video to the contest!
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {rankings.map((submission, index) => (
                <li key={submission.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4">
                          <span className="text-blue-800 font-semibold">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {submission.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            by {submission.userName || "Anonymous"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Score: {Math.round(submission.score).toLocaleString()}
                        </p>
                        <a
                          href={`https://youtube.com/watch?v=${submission.youtubeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Watch Video →
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Views</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {submission.metrics?.views.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Likes</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {submission.metrics?.likes.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Watch Hours</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {submission.metrics?.watchHours.toFixed(1) || "0.0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 