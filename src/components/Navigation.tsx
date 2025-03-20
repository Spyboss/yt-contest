import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

export async function Navigation() {
  const isUserAdmin = await isAdmin();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-3 py-2">
              <span className="text-xl font-bold">YT Contest</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                Submit Video
              </Link>
              {isUserAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-purple-600 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
} 