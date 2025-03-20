"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface VideoSubmissionFormProps {
  onSuccess?: () => void;
}

export function VideoSubmissionForm({ onSuccess }: VideoSubmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadType, setUploadType] = useState<"youtube" | "direct">("youtube");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    title: "",
    description: "",
    videoUrl: "", // For direct uploads
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          youtubeUrl: uploadType === "youtube" ? formData.youtubeUrl : formData.videoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit video");
      }

      toast.success("Video submitted successfully!");
      setFormData({ youtubeUrl: "", title: "", description: "", videoUrl: "" });
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Method
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setUploadType("youtube")}
            className={`px-4 py-2 rounded-md ${
              uploadType === "youtube"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            YouTube URL
          </button>
          <button
            type="button"
            onClick={() => setUploadType("direct")}
            className={`px-4 py-2 rounded-md ${
              uploadType === "direct"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Direct Upload
          </button>
        </div>
      </div>

      {uploadType === "youtube" ? (
        <div>
          <label
            htmlFor="youtubeUrl"
            className="block text-sm font-medium text-gray-700"
          >
            YouTube Video URL
          </label>
          <input
            type="url"
            id="youtubeUrl"
            required
            placeholder="https://youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.youtubeUrl}
            onChange={(e) =>
              setFormData({ ...formData, youtubeUrl: e.target.value })
            }
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video
          </label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <UploadDropzone<OurFileRouter, "videoUploader">
              endpoint="videoUploader"
              onUploadProgress={(progress) => {
                setUploadProgress(progress);
              }}
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setFormData((prev) => ({ ...prev, videoUrl: res[0].url }));
                  toast.success("Upload completed!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          minLength={3}
          maxLength={100}
          placeholder="Enter video title"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter video description"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (uploadType === "direct" && !formData.videoUrl)}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Video"}
        </button>
      </div>
    </form>
  );
} 