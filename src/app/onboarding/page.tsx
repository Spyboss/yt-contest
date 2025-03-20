import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold mb-6">Welcome to YouTube Contest Platform</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium">Contest Rules</h2>
                <div className="mt-2 text-sm text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Submit original YouTube videos only</li>
                    <li>Videos must be public and comply with YouTube guidelines</li>
                    <li>Subscribe to the contest channel for eligibility</li>
                    <li>One submission per contestant</li>
                    <li>Contest duration: 30 days</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium">Scoring Criteria</h2>
                <div className="mt-2 text-sm text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Views: 40%</li>
                    <li>Watch Time: 30%</li>
                    <li>Likes: 20%</li>
                    <li>Engagement: 10%</li>
                  </ul>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <a
                    href="/dashboard"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 