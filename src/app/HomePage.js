"use client";

import { getLC, getCC } from "@/app/components/Form.js";
import { useState, useEffect } from "react";
import { signInWithGoogle } from "@/app/actions/authActions";
import axios from "axios";
import { 
  Code, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Flag, 
  User, 
  Star, 
  Trophy, 
  List, 
  AlertCircle 
} from "lucide-react";

export default function HomeClient({ user }) {
  const C1 = process.env.NEXT_PUBLIC_1LC;
  const C2 = process.env.NEXT_PUBLIC_2C;
  const [lc, setLc] = useState({});
  const [cc, setCc] = useState({});
  const [loading, setLoading] = useState(true);

  function convertToIST(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  function getStatusColor(status) {
    if (status === "Accepted") return "text-green-500";
    if (status.includes("Exceeded")) return "text-yellow-500";
    return "text-red-500";
  }

  function getStatusIcon(status) {
    if (status === "Accepted") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status.includes("Exceeded")) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  }

  useEffect(() => {
    if (user?.email) {
      console.log(user);
      axios.post("/api/save", { email: user.email });
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const r1 = await getLC(C1, localStorage.getItem("leetcode"));
        const r2 = await getCC(C2, localStorage.getItem("codechef"));

        setLc(r1);
        setCc(r2);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [C1, C2]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white flex-col space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to Owlio
          </h1>
          <p className="text-gray-300 max-w-md mx-auto">
            Track your coding progress across platforms and improve your skills
          </p>
        </div>
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </form>
      </div>
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}

        {/* Stats Summary Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border-l-4 border-blue-500">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Code className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Solved (LeetCode)</p>
              <p className="text-xl font-bold">{lc.totalSolved || 0} / {lc.totalQuestions || 0}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border-l-4 border-green-500">
            <div className="bg-green-100 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">LeetCode Ranking</p>
              <p className="text-xl font-bold">#{lc.ranking || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border-l-4 border-purple-500">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CodeChef Rating</p>
              <p className="text-xl font-bold">{cc.currentRating || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CodeChef Stars</p>
              <p className="text-xl font-bold">{cc.stars || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* LeetCode Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-4 flex items-center space-x-3">
              <Code className="w-6 h-6" />
              <h2 className="text-xl font-semibold">LeetCode Stats</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Easy</p>
                  <p className="text-2xl font-bold text-blue-600">{lc.easySolved || 0} <span className="text-gray-400 text-sm font-normal">/ {lc.totalEasy || 0}</span></p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Medium</p>
                  <p className="text-2xl font-bold text-yellow-600">{lc.mediumSolved || 0} <span className="text-gray-400 text-sm font-normal">/ {lc.totalMedium || 0}</span></p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Hard</p>
                  <p className="text-2xl font-bold text-red-600">{lc.hardSolved || 0} <span className="text-gray-400 text-sm font-normal">/ {lc.totalHard || 0}</span></p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Contribution</p>
                  <p className="text-2xl font-bold text-green-600">{lc.contributionPoint || 0}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Ranking</span>
                </div>
                <span className="font-bold">#{lc.ranking || 'N/A'}</span>
              </div>
              <div className="mt-2 flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Reputation</span>
                </div>
                <span className="font-bold">{lc.reputation || 0}</span>
              </div>
            </div>
          </div>

          {/* CodeChef Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-purple-500 text-white p-4 flex items-center space-x-3">
              <Award className="w-6 h-6" />
              <h2 className="text-xl font-semibold">CodeChef Stats</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  <User className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cc.name || 'User'}</p>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {[...Array(cc.stars?.length || 0)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Current Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{cc.currentRating || 'N/A'}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Highest Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{cc.highestRating || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Global Rank</span>
                </div>
                <span className="font-bold">#{cc.globalRank || 'N/A'}</span>
              </div>
              
              <div className="mt-2 flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Country Rank ({cc.countryName || 'N/A'})</span>
                </div>
                <span className="font-bold">#{cc.countryRank || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gray-700 text-white p-4 flex items-center space-x-3">
            <List className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Recent Submissions</h2>
          </div>
          
          <div className="p-6">
            {lc?.recentSubmissions?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lc.recentSubmissions.map((submission, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 flex-1 line-clamp-2">{submission.title}</h3>
                      {getStatusIcon(submission.statusDisplay)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 p-1 rounded">
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className={`text-sm ${getStatusColor(submission.statusDisplay)}`}>
                          {submission.statusDisplay}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 p-1 rounded">
                          <Code className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-600">{submission.lang}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 p-1 rounded">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-600">{convertToIST(submission.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-lg">No recent submissions available.</p>
                <p className="text-sm mt-2">Start solving problems to see your submissions here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}