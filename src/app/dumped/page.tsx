"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Award,
  Clock,
  Code,
  User,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";

interface Submission {
  title: string;
  link: string;
  status: string;
  language: string;
  timestamp: string;
  url: string;
}

interface UserSubmissions {
  username: string;
  submissions: Submission[];
}

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<UserSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const allowedEmails =
    process.env.NEXT_DUMP_ADMIN?.split(",").map((email) => email.trim()) || [];

  useEffect(() => {
    fetch("/api/dump")
      .then((res) => res.json())
      .then((json: UserSubmissions[]) => {
        setData(json);
        setLoading(false);

        if(!session || !allowedEmails.includes(session.user?.email || "")) {
          return router.push("/");
        }
      })
      .catch((err) => {
        console.error("Error syncing submissions:", err);
        setLoading(false);
      });
  }, []);

  function getDateCategory(timestamp: string) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  function groupSubmissionsByDate(submissions: Submission[]) {
    if (!submissions || submissions.length === 0) return {};

    const grouped: { [key: string]: (Submission & { index: number })[] } = {};

    submissions.forEach((submission, index) => {
      const dateCategory = getDateCategory(submission.timestamp);

      if (!grouped[dateCategory]) {
        grouped[dateCategory] = [];
      }

      grouped[dateCategory].push({ ...submission, index });
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      if (a === "Today") return -1;
      if (b === "Today") return 1;
      if (a === "Yesterday") return -1;
      if (b === "Yesterday") return 1;

      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });

    const result: { [key: string]: (Submission & { index: number })[] } = {};
    sortedDates.forEach((date) => {
      result[date] = grouped[date];
    });

    return result;
  }

  function getStatusColor(status: string) {
    if (status === "Accepted") return "text-green-400";
    if (status === "Time Limit Exceeded" || status === "Memory Limit Exceeded")
      return "text-amber-400";
    return "text-red-400";
  }

  function getStatusBg(status: string) {
    if (status === "Accepted") return "bg-green-900/30";
    if (status === "Time Limit Exceeded" || status === "Memory Limit Exceeded")
      return "bg-amber-900/30";
    return "bg-red-900/30";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 md:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center w-full py-16">
            <div className="text-center text-gray-400">
              <User size={60} className="mx-auto text-gray-500 mb-6" />
              <h3 className="text-xl font-medium mb-3">No submissions found</h3>
              <p>No user submissions available</p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col min-h-[calc(100vh-300px)]">
            <div className="flex overflow-x-auto py-4 space-x-4">
              {data.map((user, userIndex) => (
                <div
                  key={user.username}
                  className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow min-w-[350px] max-w-[350px] flex-shrink-0 flex flex-col border border-gray-700 overflow-hidden h-full"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Award size={20} />
                        {user.username}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white"
                      >
                        {user.submissions.length} submissions
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex-grow">
                    {user.submissions.length > 0 ? (
                      <div>
                        <h3 className="text-md font-semibold text-gray-200 mb-3 flex items-center gap-2">
                          <Clock size={16} /> Recent Submissions
                        </h3>

                        <div className="space-y-6">
                          {Object.entries(
                            groupSubmissionsByDate(user.submissions)
                          ).map(([date, submissions]) => (
                            <div key={date} className="mb-6">
                              <h4 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-2 flex items-center gap-2">
                                <Calendar size={14} className="text-blue-400" />
                                {date}
                              </h4>
                              <div className="space-y-4">
                                {submissions.map((submission) => {
                                  return (
                                    <div
                                      key={submission.index}
                                      className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700/50 transition-colors shadow-sm hover:shadow"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <p
                                          className="text-gray-200 text-base font-bold flex-grow"
                                          title={submission.title}
                                        >
                                          {submission.title}
                                        </p>
                                      </div>

                                      <div className="flex justify-between items-center mb-3">
                                        <Badge
                                          variant="outline"
                                          className={`${getStatusBg(
                                            submission.status
                                          )} ${getStatusColor(
                                            submission.status
                                          )} border-0 text-sm py-1 px-2`}
                                        >
                                          {submission.status}
                                        </Badge>

                                        <Badge
                                          variant="outline"
                                          className="text-gray-300 border-gray-500 font-bold text-sm py-1 px-2"
                                        >
                                          {submission.language}
                                        </Badge>
                                      </div>

                                      <p className="text-sm text-gray-300 font-bold mb-4 flex items-center gap-1">
                                        <Clock size={14} />
                                        {new Date(
                                          submission.timestamp
                                        ).toLocaleString("en-IN", {
                                          timeZone: "Asia/Kolkata",
                                        })}
                                      </p>

                                      <div className="flex gap-3">
                                        <a
                                          href={submission.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                                        >
                                          <ArrowRight size={16} /> Problem
                                        </a>

                                        <a
                                          href={submission.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex-1 ${getStatusBg(
                                            submission.status
                                          )} ${getStatusColor(
                                            submission.status
                                          )} text-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2 border border-gray-600`}
                                        >
                                          <Code size={16} /> Code
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <User size={48} className="text-gray-500 mb-4" />
                        <p className="text-gray-400">
                          No submissions available for {user.username}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
