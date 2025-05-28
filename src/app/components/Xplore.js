"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLC, getLC2, getLC3 } from "@/app/components/Form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle, Clock, Code, User, Calendar, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function XplorePage() {
  const [stats, setStats] = useState(Array(10).fill({}));
  const [newStats, setNewStats] = useState(Array(10).fill({}));
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState({});
  const [problemDetails, setProblemDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const form = useForm();
  const scrollContainerRef = useRef(null);
  const formScrollContainerRef = useRef(null);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    async function fetchData() {
      const usernamesString = localStorage.getItem("usernames");
      const usernames = usernamesString ? JSON.parse(usernamesString) : [];
      setNames(usernames);

      if (userEmail) {
        await fetch("/api/user/update-friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            friends: usernames.filter(Boolean),
          }),
        });
      }

      if (usernames.some(username => username)) {
        setLoading(true);

        const updatedStats = await Promise.all(
          usernames.map(async (username) => {
            if (username) {
              return await getLC(process.env.NEXT_PUBLIC_1LC, username);
            }
            return {};
          })
        );
        setStats(updatedStats);

        const updatedNewStats = await Promise.all(
          usernames.map(async (username) => {
            if (username) {
              return await getLC2(username);
            }
            return {};
          })
        );
        setNewStats(updatedNewStats);
        setLoading(false);
      }
    }

    fetchData().then(async () => {
      await fetch("/api/user/update-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          friends: names.filter(Boolean),
        }),
      });
    });
  }, []);

  async function onSubmit(data) {
    setLoading(true);
    const temp = localStorage.getItem("usernames");
    const prev = temp ? JSON.parse(temp) : Array(10).fill(null);

    const usernames = [
      data.friend1 || prev[0],
      data.friend2 || prev[1],
      data.friend3 || prev[2],
      data.friend4 || prev[3],
      data.friend5 || prev[4],
      data.friend6 || prev[5],
      data.friend7 || prev[6],
      data.friend8 || prev[7],
      data.friend9 || prev[8],
      data.friend10 || prev[9],
    ];

    setNames(usernames);
    localStorage.setItem("usernames", JSON.stringify(usernames));

    if (userEmail) {
      await fetch("/api/user/update-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          friends: usernames.filter(Boolean),
        }),
      });
    }

    const updatedStats = await Promise.all(
      usernames.map(async (username) => {
        if (username) {
          return await getLC(process.env.NEXT_PUBLIC_1LC, username);
        }
        return {};
      })
    );
    setStats(updatedStats);

    const updatedNewStats = await Promise.all(
      usernames.map(async (username) => {
        if (username) {
          return await getLC2(username);
        }
        return {};
      })
    );
    setNewStats(updatedNewStats);
    setLoading(false);
  }

  function convertToIST(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  function getDateCategory(timestamp) {
    const date = new Date(timestamp * 1000);
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

  function groupSubmissionsByDate(submissions) {
    if (!submissions || submissions.length === 0) return {};

    const grouped = {};

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
      return dateB - dateA;
    });

    const result = {};
    sortedDates.forEach(date => {
      result[date] = grouped[date];
    });

    return result;
  }

  function getStatusColor(status) {
    if (status === "Accepted") return "text-green-600";
    if (status === "Time Limit Exceeded" || status === "Memory Limit Exceeded")
      return "text-amber-600";
    return "text-red-600";
  }

  function getStatusBg(status) {
    if (status === "Accepted") return "bg-green-100";
    if (status === "Time Limit Exceeded" || status === "Memory Limit Exceeded")
      return "bg-amber-100";
    return "bg-red-100";
  }

  function getDifficultyColor(difficulty) {
    if (difficulty === "Easy") return "bg-green-100 text-green-800";
    if (difficulty === "Medium") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  }

  async function fetchProblemDetails(userIndex, submissionIndex) {
    const titleSlug = newStats[userIndex]?.[submissionIndex]?.titleSlug;

    if (!titleSlug) return;

    const detailKey = `${userIndex}-${submissionIndex}`;

    setLoadingDetails(prev => ({
      ...prev,
      [detailKey]: true
    }));

    try {
      const details = await getLC3(titleSlug);

      setProblemDetails(prev => ({
        ...prev,
        [detailKey]: details
      }));
    } catch (error) {
      console.error("Error fetching problem details:", error);
    } finally {
      setLoadingDetails(prev => ({
        ...prev,
        [detailKey]: false
      }));
    }
  }

  const toggleDetails = async (userIndex, submissionIndex) => {
    const detailKey = `${userIndex}-${submissionIndex}`;

    setVisibleDetails(prev => {
      const newState = {
        ...prev,
        [detailKey]: !prev[detailKey]
      };

      if (newState[detailKey] && !problemDetails[detailKey]) {
        fetchProblemDetails(userIndex, submissionIndex);
      }

      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
        <Card className="mb-4 relative">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div
                  ref={formScrollContainerRef}
                  className="flex overflow-x-auto py-4 space-x-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((friend, index) => (
                    <div key={index} className="min-w-[200px] flex-shrink-0">
                      <FormField
                        control={form.control}
                        name={`friend${friend}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <User size={14} className="text-blue-500" /> Bro {friend}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="LeetCode Username"
                                {...field}
                                defaultValue={names[index] || ""}
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Get Stats"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col min-h-[calc(100vh-300px)]">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto py-4 space-x-4"
            >
              {stats.map((stat, userIndex) => (
                names[userIndex] && (
                  <div
                    key={userIndex}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow min-w-[350px] max-w-[350px] flex-shrink-0 flex flex-col border border-gray-200 overflow-hidden h-full"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Award size={20} />
                          {names[userIndex]}
                        </h2>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          Bro {userIndex + 1}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5 flex-grow">
                      {stat?.totalSolved ? (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-blue-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-blue-700 font-medium">Total Solved</p>
                              <p className="text-xl font-bold text-blue-900">
                                {stat?.totalSolved} <span className="text-sm text-blue-600">/ {stat?.totalQuestions}</span>
                              </p>
                            </div>

                            <div className="bg-green-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-green-700 font-medium">Easy</p>
                              <p className="text-xl font-bold text-green-900">
                                {stat?.easySolved} <span className="text-sm text-green-600">/ {stat?.totalEasy}</span>
                              </p>
                            </div>

                            <div className="bg-amber-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-amber-700 font-medium">Medium</p>
                              <p className="text-xl font-bold text-amber-900">
                                {stat?.mediumSolved} <span className="text-sm text-amber-600">/ {stat?.totalMedium}</span>
                              </p>
                            </div>

                            <div className="bg-red-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-red-700 font-medium">Hard</p>
                              <p className="text-xl font-bold text-red-900">
                                {stat?.hardSolved} <span className="text-sm text-red-600">/ {stat?.totalHard}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm px-2 py-2">
                            <p className="text-green-700 font-medium">
                              Easy: {stat?.totalSolved ? ((stat?.easySolved / stat?.totalSolved) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-amber-700 font-medium">
                              Medium: {stat?.totalSolved ? ((stat?.mediumSolved / stat?.totalSolved) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-red-700 font-medium">
                              Hard: {stat?.totalSolved ? ((stat?.hardSolved / stat?.totalSolved) * 100).toFixed(1) : 0}%
                            </p>
                          </div>


                          <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Clock size={16} /> Recent Submissions
                            </h3>

                            {stat?.recentSubmissions?.length > 0 ? (
                              <div className="space-y-6">
                                {Object.entries(groupSubmissionsByDate(stat.recentSubmissions)).map(([date, submissions]) => (
                                  <div key={date} className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
                                      <Calendar size={14} className="text-blue-500" />
                                      {date}
                                    </h4>
                                    <div className="space-y-4">
                                      {submissions.map((submission) => {
                                        const detailKey = `${userIndex}-${submission.index}`;
                                        const isDetailsVisible = visibleDetails[detailKey];
                                        const details = problemDetails[detailKey];
                                        const isLoading = loadingDetails[detailKey];

                                        return (
                                          <div
                                            key={submission.index}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                                          >
                                            <div className="flex justify-between items-center mb-2">
                                              <p className="text-gray-800 text-base font-bold flex-grow" title={submission.title}>
                                                {submission.title}
                                              </p>

                                              {!isDetailsVisible && (
                                                <button
                                                  onClick={() => toggleDetails(userIndex, submission.index)}
                                                  className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                                                  aria-label="Show problem details"
                                                >
                                                  <Eye size={18} />
                                                </button>
                                              )}
                                            </div>

                                            {isDetailsVisible && (
                                              <div className="mb-3 bg-gray-50 p-3 rounded-md flex flex-col space-y-2">
                                                {isLoading ? (
                                                  <div className="flex justify-center py-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                                                  </div>
                                                ) : details ? (
                                                  <div className="flex flex-col space-y-2">
                                                    <div className="flex justify-between items-center">
                                                      <div className="text-sm text-gray-700 flex-grow">
                                                        {details.topicTags?.map(tag => tag.name).join(', ')}
                                                      </div>
                                                      <div className={`font-medium px-2 py-1 rounded-md text-xs ${getDifficultyColor(details.difficulty)}`}>
                                                        {details.difficulty}
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="text-sm text-gray-500">
                                                    Problem details not available
                                                  </div>
                                                )}
                                                <div className="flex justify-end">
                                                  <button
                                                    onClick={() => toggleDetails(userIndex, submission.index)}
                                                    className="text-gray-500 hover:text-blue-600 transition-colors p-1 text-xs flex items-center"
                                                    aria-label="Hide problem details"
                                                  >
                                                    <EyeOff size={14} className="mr-1" /> Hide
                                                  </button>
                                                </div>
                                              </div>
                                            )}

                                            <div className="flex justify-between items-center mb-3">
                                              <Badge className={`${getStatusBg(submission.statusDisplay)} ${getStatusColor(submission.statusDisplay)} border-0 text-sm py-1 px-2`}>
                                                {submission.statusDisplay}
                                              </Badge>

                                              <Badge variant="outline" className="text-gray-700 font-bold text-sm py-1 px-2">
                                                {submission.lang}
                                              </Badge>
                                            </div>

                                            <p className="text-sm text-gray-800 font-bold mb-4 flex items-center gap-1">
                                              <Clock size={14} />
                                              {convertToIST(submission.timestamp)}
                                            </p>

                                            <div className="flex gap-3">
                                              <a
                                                href={`https://leetcode.com/problems/${newStats[userIndex]?.[submission.index]?.titleSlug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                                              >
                                                <ArrowRight size={16} /> Problem
                                              </a>

                                              <a
                                                href={`https://leetcode.com${newStats[userIndex]?.[submission.index]?.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 ${getStatusBg(submission.statusDisplay)} ${getStatusColor(submission.statusDisplay)} text-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2`}
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
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <p className="mb-2">No recent submissions</p>
                                <CheckCircle size={28} className="mx-auto text-gray-400" />
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                          <User size={48} className="text-gray-300 mb-4" />
                          <p className="text-gray-500">No stats available for {names[userIndex] || `Bro ${userIndex + 1}`}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}

              {!names.some(name => name) && (
                <div className="flex items-center justify-center w-full py-16">
                  <div className="text-center text-gray-500">
                    <User size={60} className="mx-auto text-gray-300 mb-6" />
                    <h3 className="text-xl font-medium mb-3">No users added yet</h3>
                    <p>Enter LeetCode usernames above to see their stats</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}