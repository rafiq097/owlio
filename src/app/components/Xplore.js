"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { ArrowRight, Award, CheckCircle, Clock, Code, User } from "lucide-react";

export default function XplorePage() {
    const [stats, setStats] = useState(Array(10).fill({}));
    const [newStats, setNewStats] = useState(Array(10).fill({}));
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const form = useForm();

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
                        <div className="absolute top-1/2 -left-4 hidden md:flex items-center justify-center">
                            <button className="rounded-full bg-white shadow-md p-2 focus:outline-none" aria-label="Scroll left">
                                <ArrowRight size={20} className="transform rotate-180 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex overflow-x-auto py-4 pb-6 snap-x space-x-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {stats.map((stat, index) => (
                                names[index] && (
                                    <div
                                        key={index}
                                        className="snap-start bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 min-w-[320px] max-w-[320px] flex-shrink-0 flex flex-col border border-gray-200 overflow-hidden"
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
                                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                                                {stat.recentSubmissions.map((submission, subIndex) => (
                                                                    <div
                                                                        key={subIndex}
                                                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <p className="font-medium text-gray-800 mb-1 truncate" title={submission.title}>
                                                                            {submission.title}
                                                                        </p>

                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <Badge className={`${getStatusBg(submission.statusDisplay)} ${getStatusColor(submission.statusDisplay)} border-0`}>
                                                                                {submission.statusDisplay}
                                                                            </Badge>

                                                                            <Badge variant="outline" className="text-gray-600">
                                                                                {submission.lang}
                                                                            </Badge>
                                                                        </div>

                                                                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                                                            <Clock size={12} />
                                                                            {convertToIST(submission.timestamp)}
                                                                        </p>

                                                                        <div className="flex gap-2">
                                                                            <a
                                                                                href={`https://leetcode.com/problems/${newStats[index][subIndex]?.titleSlug}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex-1 bg-blue-600 text-white text-center px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-1"
                                                                            >
                                                                                <ArrowRight size={12} /> Problem
                                                                            </a>

                                                                            <a
                                                                                href={`https://leetcode.com/${newStats[index][subIndex]?.url}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={`flex-1 ${getStatusBg(submission.statusDisplay)} ${getStatusColor(submission.statusDisplay)}  text-center px-2 py-1 rounded-md text-xs font-medium transition-colors flex justify-center items-center gap-1`}
                                                                            >
                                                                                <Code size={12} /> Code
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-gray-500">
                                                                <p className="mb-2">No recent submissions</p>
                                                                <CheckCircle size={24} className="mx-auto text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full py-10">
                                                    <User size={40} className="text-gray-300 mb-3" />
                                                    <p className="text-gray-500">No stats available for {names[index] || `Bro ${index + 1}`}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}

                            {!names.some(name => name) && (
                                <div className="flex items-center justify-center w-full py-12">
                                    <div className="text-center text-gray-500">
                                        <User size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-xl font-medium mb-2">No users added yet</h3>
                                        <p>Enter LeetCode usernames above to see their stats</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="absolute top-1/2 -right-4 hidden md:flex items-center justify-center">
                            <button className="rounded-full bg-white shadow-md p-2 focus:outline-none" aria-label="Scroll right">
                                <ArrowRight size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}