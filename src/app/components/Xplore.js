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
import { getLC, getLC2 } from "@/app/components/Form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle, Clock, Code, User, Calendar } from "lucide-react";

export default function XplorePage() {
    const [stats, setStats] = useState(Array(10).fill({}));
    const [newStats, setNewStats] = useState(Array(10).fill({}));
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const form = useForm();
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        async function fetchData() {
            const usernamesString = localStorage.getItem("usernames");
            const usernames = usernamesString ? JSON.parse(usernamesString) : [];
            setNames(usernames);

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

        fetchData();
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
            
            grouped[dateCategory].push({...submission, index});
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    LeetCode Stats Explorer
                </h1>

                <Card className="mb-8">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Enter LeetCode Usernames
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((friend, index) => (
                                        <FormField
                                            key={index}
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
                                                            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
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
                    <div className="relative">
                        <div className="absolute top-1/2 -left-4 hidden md:flex items-center justify-center z-10">
                            <button 
                                onClick={scrollLeft}
                                className="rounded-full bg-white shadow-md p-2 focus:outline-none hover:bg-gray-100 active:bg-gray-200" 
                                aria-label="Scroll left"
                            >
                                <ArrowRight size={20} className="transform rotate-180 text-gray-600" />
                            </button>
                        </div>

                        <div 
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto py-4 pb-6 space-x-6 snap-x scroll-smooth scrollbar-hide touch-pan-x"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                                scrollSnapType: 'x mandatory'
                            }}
                        >
                            {stats.map((stat, index) => (
                                names[index] && (
                                    <div
                                        key={index}
                                        className="snap-center bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 min-w-[350px] max-w-[350px] flex-shrink-0 flex flex-col border border-gray-200 overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Award size={20} />
                                                    {names[index]}
                                                </h2>
                                                <Badge variant="secondary" className="bg-white/20 text-white">
                                                    Bro {index + 1}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-grow">
                                            {stat?.totalSolved ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                                            <p className="text-xs text-blue-700 font-medium">Total Solved</p>
                                                            <p className="text-xl font-bold text-blue-900">
                                                                {stat?.totalSolved} <span className="text-sm text-blue-600">/ {stat?.totalQuestions}</span>
                                                            </p>
                                                        </div>

                                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                                            <p className="text-xs text-green-700 font-medium">Easy</p>
                                                            <p className="text-xl font-bold text-green-900">
                                                                {stat?.easySolved} <span className="text-sm text-green-600">/ {stat?.totalEasy}</span>
                                                            </p>
                                                        </div>

                                                        <div className="bg-amber-50 rounded-lg p-3 text-center">
                                                            <p className="text-xs text-amber-700 font-medium">Medium</p>
                                                            <p className="text-xl font-bold text-amber-900">
                                                                {stat?.mediumSolved} <span className="text-sm text-amber-600">/ {stat?.totalMedium}</span>
                                                            </p>
                                                        </div>

                                                        <div className="bg-red-50 rounded-lg p-3 text-center">
                                                            <p className="text-xs text-red-700 font-medium">Hard</p>
                                                            <p className="text-xl font-bold text-red-900">
                                                                {stat?.hardSolved} <span className="text-sm text-red-600">/ {stat?.totalHard}</span>
                                                            </p>
                                                        </div>
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
                                                                            {submissions.map((submission) => (
                                                                                <div
                                                                                    key={submission.index}
                                                                                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                                                                                >
                                                                                    <p className="text-gray-800 mb-2 text-base font-bold" title={submission.title}>
                                                                                        {submission.title}
                                                                                    </p>

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
                                                                                            href={`https://leetcode.com/problems/${newStats[index][submission.index]?.titleSlug}`}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                                                                                        >
                                                                                            <ArrowRight size={16} /> Problem
                                                                                        </a>

                                                                                        <a
                                                                                            href={`https://leetcode.com/${newStats[index][submission.index]?.url}`}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className={`flex-1 ${getStatusBg(submission.statusDisplay)} ${getStatusColor(submission.statusDisplay)} text-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2`}
                                                                                        >
                                                                                            <Code size={16} /> Code
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
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
                                                    <p className="text-gray-500">No stats available for {names[index] || `Bro ${index + 1}`}</p>
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

                        <div className="absolute top-1/2 -right-4 hidden md:flex items-center justify-center z-10">
                            <button 
                                onClick={scrollRight}
                                className="rounded-full bg-white shadow-md p-2 focus:outline-none hover:bg-gray-100 active:bg-gray-200" 
                                aria-label="Scroll right"
                            >
                                <ArrowRight size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}