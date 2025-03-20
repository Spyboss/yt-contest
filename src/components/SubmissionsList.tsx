"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VideoMetrics {
  views: number;
  likes: number;
  watchHours: number;
}

interface Submission {
  id: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  metrics: VideoMetrics;
  createdAt: string;
}

export function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions");
      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      toast.error("Failed to load submissions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No submissions yet</h3>
        <p className="mt-2 text-sm text-gray-600">
          Start participating in the contest by submitting your first video!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {submission.title}
                </h3>
                {submission.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {submission.description}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    submission.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : submission.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {submission.status.charAt(0) + submission.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`https://youtube.com/watch?v=${submission.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Watch on YouTube →
              </a>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Views</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {submission.metrics.views.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Likes</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {submission.metrics.likes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Watch Hours</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {submission.metrics.watchHours.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Submitted on{" "}
              {new Date(submission.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 