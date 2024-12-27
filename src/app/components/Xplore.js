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

import { getLC } from "@/app/components/Form";

export default function XplorePage() {
    const [stats, setStats] = useState([{}, {}, {}, {}]);
    const [names, setNames] = useState([]);
    const form = useForm();

    useEffect(() => {
        async function fetchData() {
            const usernamesString = localStorage.getItem("usernames");
            const usernames = usernamesString ? JSON.parse(usernamesString) : [];
            setNames(usernames);

            const updatedStats = await Promise.all(
                usernames.map(async (username) => {
                    if (username) {
                        return await getLC(process.env.NEXT_PUBLIC_1C, username);
                    }
                    return {};
                })
            );

            setStats(updatedStats);
        }

        fetchData();
    }, []);

    async function onSubmit(data) {
        // const usernames = [data.friend1, data.friend2, data.friend3, data.friend4];
        const previousUsernamesString = localStorage.getItem("usernames");
        const previousUsernames = previousUsernamesString
            ? JSON.parse(previousUsernamesString)
            : [null, null, null, null];

        const usernames = [
            data.friend1 || previousUsernames[0],
            data.friend2 || previousUsernames[1],
            data.friend3 || previousUsernames[2],
            data.friend4 || previousUsernames[3],
        ];
        
        setNames(usernames);

        localStorage.setItem("usernames", JSON.stringify(usernames));
        const updatedStats = await Promise.all(
            usernames.map(async (username) => {
                if (username) {
                    return await getLC(process.env.NEXT_PUBLIC_1C, username);
                }
                return {};
            })
        );

        console.log(updatedStats);
        setStats(updatedStats);
    }

    function convertToIST(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }

    function getStatusColor(status) {
        if (status === "Accepted") return "text-green-500";
        if (status === "Time Limit Exceeded" || status === "Memory Limit Exceeded")
            return "text-yellow-500";
        return "text-red-500";
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        {[1, 2, 3, 4].map((friend, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`friend${friend}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Friend {friend}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="LC Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button type="submit">GET</Button>
                    </div>
                </form>
            </Form>

            <div className="mt-8 space-y-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between min-h-[350px]"
                    >
                        {stat?.totalSolved ? (
                            <div className="bg-white shadow-md rounded-xl p-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Friend {index + 1}: {names[index]} LeetCode Stats
                                </h2>
                                <p>
                                    <strong>Total Solved:</strong> {stat?.totalSolved} /{" "}
                                    {stat?.totalQuestions}
                                </p>
                                <p>
                                    <strong>Easy Solved:</strong> {stat?.easySolved} / {stat?.totalEasy}
                                </p>
                                <p>
                                    <strong>Medium Solved:</strong> {stat?.mediumSolved} /{" "}
                                    {stat?.totalMedium}
                                </p>
                                <p>
                                    <strong>Hard Solved:</strong> {stat?.hardSolved} / {stat?.totalHard}
                                </p>
                                <h2 className="mt-4 text-lg font-semibold text-gray-800 mb-3">
                                    Recent Submissions
                                </h2>
                                <div className="grid gap-4">
                                    {stat?.recentSubmissions?.length > 0 ? (
                                        stat.recentSubmissions.map((submission, subIndex) => (
                                            <div
                                                key={subIndex}
                                                className="bg-gray-50 p-2 border rounded shadow hover:shadow-lg"
                                            >
                                                <p>
                                                    <strong>Title:</strong> {submission.title}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    <span
                                                        className={`${getStatusColor(submission.statusDisplay)}`}
                                                    >
                                                        {submission.statusDisplay}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>Language:</strong> {submission.lang}
                                                </p>
                                                <p>
                                                    <strong>Time:</strong>{" "}
                                                    {convertToIST(submission.timestamp)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No recent submissions available.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">No stats available for Friend {index + 1}.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
