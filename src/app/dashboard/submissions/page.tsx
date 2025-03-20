import { SubmissionsList } from "@/components/SubmissionsList";
import { Toaster } from "sonner";

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your contest video submissions.
          </p>
        </div>

        <SubmissionsList />
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 