"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Submit Video Card */}
          <Link href="/dashboard/submit" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Submit Video</h2>
              <p className="text-gray-600 mb-4">
                Submit your YouTube video for the contest.
              </p>
              <span className="text-blue-600 font-medium">Get started →</span>
            </div>
          </Link>

          {/* Rankings Card */}
          <Link href="/dashboard/rankings" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Contest Rankings</h2>
              <p className="text-gray-600 mb-4">
                View current contest standings and rankings.
              </p>
              <span className="text-blue-600 font-medium">View rankings →</span>
            </div>
          </Link>

          {/* My Submissions Card */}
          <Link href="/dashboard/submissions" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
              <p className="text-gray-600 mb-4">
                Track and manage your video submissions.
              </p>
              <span className="text-blue-600 font-medium">View submissions →</span>
            </div>
          </Link>
        </div>

        {/* Contest Rules and Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contest Rules & Guidelines</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Submission Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Videos must be uploaded to YouTube and set to <span className="font-medium">public</span></li>
                <li>Content must be <span className="font-medium">original</span> and created by you</li>
                <li>Video length: Minimum 1 minute, maximum 15 minutes</li>
                <li>Must include the hashtag <span className="font-medium">#YTContest2024</span> in the description</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Contest Schedule</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Submissions open: 1st - 25th of each month</li>
                <li>Voting period: 26th - 28th of each month</li>
                <li>Winners announced: Last day of each month</li>
                <li>Multiple submissions allowed (max 3 per month)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Judging Criteria</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Creativity and originality (40%)</li>
                <li>Production quality (30%)</li>
                <li>Audience engagement (views, likes, comments) (20%)</li>
                <li>Community voting (10%)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Prizes</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>🥇 First Place: $1000 + Featured Creator Status</li>
                <li>🥈 Second Place: $500 + Premium Membership</li>
                <li>🥉 Third Place: $250 + Premium Membership</li>
                <li>Community Choice: $250 Special Prize</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2 text-blue-800">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-700">
                <li>All videos must comply with YouTube Community Guidelines</li>
                <li>Content must be appropriate for general audiences</li>
                <li>Violation of rules will result in submission disqualification</li>
                <li>Judges' decisions are final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 