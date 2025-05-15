"use client";

import { getLC, getCC } from "@/app/components/Form.js";
import { useState, useEffect } from "react";
import { signInWithGoogle } from "@/app/actions/authActions";
import axios from "axios";

export default function HomeClient({ user }) {
  const C1 = process.env.NEXT_PUBLIC_1LC;
  const C2 = process.env.NEXT_PUBLIC_2C;
  const [lc, setLc] = useState({});
  const [cc, setCc] = useState({});

  function convertToIST(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  function getStatusColor(status) {
    if (status === "Accepted") return "text-green-500";
    if (status.includes("Exceeded")) return "text-yellow-500";
    return "text-red-500";
  }

  useEffect(() => {
    if (user?.email) {
      console.log(user);
      axios.post("/api/save", { email: user.email });
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      const r1 = await getLC(C1, localStorage.getItem("leetcode"));
      const r2 = await getCC(C2, localStorage.getItem("codechef"));

      setLc(r1);
      setCc(r2);
    }

    fetchData();
  }, [C1, C2]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white flex-col space-y-6">
        <h1 className="text-3xl font-semibold">Welcome to Owlio</h1>
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    );
  

  return (
    <div>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">User Dashboard</h1>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* LeetCode Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">LeetCode Stats</h2>
            <div className="text-gray-700">
              <p><strong>Total Solved:</strong> {lc.totalSolved} / {lc.totalQuestions}</p>
              <p><strong>Easy Solved:</strong> {lc.easySolved} / {lc.totalEasy}</p>
              <p><strong>Medium Solved:</strong> {lc.mediumSolved} / {lc.totalMedium}</p>
              <p><strong>Hard Solved:</strong> {lc.hardSolved} / {lc.totalHard}</p>
              <p><strong>Ranking:</strong> #{lc.ranking}</p>
              <p><strong>Reputation:</strong> {lc.reputation}</p>
              <p><strong>Contribution Points:</strong> {lc.contributionPoint}</p>
            </div>
          </div>

          {/* CodeChef Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">CodeChef Stats</h2>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-lg font-semibold">{cc.name}</p>
                <p className="text-sm text-gray-600">{cc.stars}</p>
              </div>
            </div>
            <div className="mt-4 text-gray-700">
              <p><strong>Current Rating:</strong> {cc.currentRating}</p>
              <p><strong>Highest Rating:</strong> {cc.highestRating}</p>
              <p><strong>Global Rank:</strong> #{cc.globalRank}</p>
              <p><strong>Country Rank:</strong> #{cc.countryRank} ({cc.countryName})</p>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mt-10 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lc?.recentSubmissions?.length > 0 ? (
              lc.recentSubmissions.map((submission, index) => (
                <div key={index} className="bg-gray-50 p-4 border rounded-lg shadow hover:shadow-lg">
                  <h3 className="text-lg font-bold">{submission.title}</h3>
                  <p><strong>Status:</strong> <span className={getStatusColor(submission.statusDisplay)}>{submission.statusDisplay}</span></p>
                  <p><strong>Language:</strong> {submission.lang}</p>
                  <p><strong>Time:</strong> {convertToIST(submission.timestamp)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent submissions available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
