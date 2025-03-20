"use client";

import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { VideoSubmissionForm } from "@/components/VideoSubmissionForm";
import { Toaster } from "sonner";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Submit Your Video</h1>
            <p className="mt-2 text-sm text-gray-600">
              Share your YouTube video for the contest. Make sure your video follows our guidelines.
            </p>
          </div>

          {/* Submission Guidelines */}
          <div className="mb-8 bg-blue-50 rounded-md p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">
              Submission Guidelines
            </h2>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Video must be public on YouTube</li>
              <li>• Content must be original and created by you</li>
              <li>• Video length: 1-15 minutes</li>
              <li>• Include #YTContest2024 in video description</li>
              <li>• Maximum 3 submissions per month</li>
            </ul>
          </div>

          <VideoSubmissionForm />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 