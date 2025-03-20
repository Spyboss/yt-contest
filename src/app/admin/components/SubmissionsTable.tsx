"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Submission {
  id: string;
  title: string;
  youtubeVideoId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  metrics?: {
    views: number;
    likes: number;
    watchHours: number;
  };
}

export function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();
      setSubmissions(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchSubmissions(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating submission status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Metrics</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <a
                  href={`https://youtube.com/watch?v=${submission.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {submission.title}
                </a>
              </TableCell>
              <TableCell>
                <div>{submission.user.name}</div>
                <div className="text-sm text-gray-500">{submission.user.email}</div>
              </TableCell>
              <TableCell>{getStatusBadge(submission.status)}</TableCell>
              <TableCell>
                {submission.metrics ? (
                  <div>
                    <div>Views: {submission.metrics.views}</div>
                    <div>Likes: {submission.metrics.likes}</div>
                    <div>Watch Hours: {submission.metrics.watchHours.toFixed(2)}</div>
                  </div>
                ) : (
                  "No metrics"
                )}
              </TableCell>
              <TableCell>
                {submission.status === "PENDING" && (
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleStatusUpdate(submission.id, "APPROVED")}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(submission.id, "REJECTED")}
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 