"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, User, UserCog, Award, Code, Clock, Grid3x3, Shield, Activity } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    const fetchUsers = async () => {
      if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN) {
        router.push("/");
        return;
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      } else {
        router.push("/");
      }
    };

    fetchUsers();
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-500/20 border-r-purple-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          </div>
          <p className="text-gray-300 font-medium text-lg">Loading...</p>
          <div className="mt-2 flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const displayFriends = (friends) => {
    if (!friends || friends.length === 0) {
      return <span className="text-gray-500 italic text-sm">No friends yet</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5 max-w-xs">
        {friends.map((friend, idx) => (
          <span
            key={idx}
            className="bg-gray-800/60 text-gray-300 text-xs font-medium px-2.5 py-1.5 rounded-full border border-gray-700/50 flex items-center backdrop-blur-sm hover:bg-gray-700/60 transition-colors duration-200"
          >
            <User size={10} className="mr-1 flex-shrink-0 text-cyan-400" />
            <span className="">{friend}</span>
          </span>
        ))}
      </div>
    );
  };

  const displayTimes = (times) => {
    if (!times || times.length === 0) {
      return <span className="text-gray-500 italic text-sm">Not visited</span>;
    }

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {times.map((time, idx) => (
            <span
              key={idx}
              className="bg-red-900/40 text-red-300 text-md font-mono px-2.5 py-1.5 rounded-lg border border-red-800/50 flex items-center backdrop-blur-sm hover:bg-blue-800/40 transition-colors duration-200"
            >
              <Clock size={10} className="mr-1 flex-shrink-0 text-red-400" />
              {time}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="p-3 sm:p-6 lg:p-8 max-w-full mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {users.length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                <Users className="h-7 w-7 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Profiles</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {users.filter(user => user.leetcode || user.codechef).length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 rounded-xl border border-emerald-500/20 group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all duration-300">
                <Code className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">With Friends</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {users.filter(user => user.friends && user.friends.length > 0).length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                <Users className="h-7 w-7 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="block xl:hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center">
                <div className="p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl inline-block mb-4">
                  <Users className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-gray-300 font-medium text-lg mb-2">No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {users.map((user, i) => (
                  <div key={i} className="p-4 sm:p-6 hover:bg-gray-800/30 transition-all duration-200">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                          <User size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-white truncate">{user.email}</p>
                          <p className="text-sm text-gray-400">#{i + 1}</p>
                        </div>
                      </div>

                      <div className="bg-red-800/40 rounded-xl p-4 border border-red-700/30">
                        <p className="text-sm font-medium text-red-300 mb-3 flex items-center">
                          <Clock size={14} className="mr-2 text-red-400" />
                          Time
                        </p>
                        {displayTimes(user.times)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                          <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <Code size={14} className="mr-2 text-yellow-400" />
                            LeetCode
                          </p>
                          {user.leetcode ? (
                            <span className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300 px-3 py-2 rounded-lg text-sm font-medium border border-yellow-500/30 block text-center">
                              {user.leetcode}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic text-sm block text-center py-2">Not set</span>
                          )}
                        </div>
                        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                          <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <Award size={14} className="mr-2 text-orange-400" />
                            CodeChef
                          </p>
                          {user.codechef ? (
                            <span className="bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-300 px-3 py-2 rounded-lg text-sm font-medium border border-orange-500/30 block text-center">
                              {user.codechef}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic text-sm block text-center py-2">Not set</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                        <p className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Users size={14} className="mr-2 text-purple-400" />
                          Friends ({user.friends?.length || 0})
                        </p>
                        {displayFriends(user.friends)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden xl:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-blue-400" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-400" />
                      Times
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Code size={16} className="mr-2 text-yellow-400" />
                      LeetCode
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Award size={16} className="mr-2 text-orange-400" />
                      CodeChef
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-purple-400" />
                      Friends
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-gray-700/30">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl inline-block mb-4">
                        <Users className="h-12 w-12 text-gray-500" />
                      </div>
                      <p className="text-gray-300 font-medium text-lg mb-2">No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-800/30 transition-all duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-400/40 transition-colors duration-200">
                            <User size={18} className="text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-white">{user.email}</div>
                            <div className="text-xs text-gray-400">#{i + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        {displayTimes(user.times)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.leetcode ? (
                          <span className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300 px-3 py-2 rounded-lg text-xs font-medium border border-yellow-500/30 hover:border-yellow-400/50 transition-colors duration-200">
                            {user.leetcode}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.codechef ? (
                          <span className="bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-300 px-3 py-2 rounded-lg text-xs font-medium border border-orange-500/30 hover:border-orange-400/50 transition-colors duration-200">
                            {user.codechef}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        {displayFriends(user.friends)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-t border-gray-700/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Showing {users.length} user{users.length !== 1 ? 's' : ''}</span>
              </div>
              <span className="flex items-center space-x-2">
                <Clock size={12} />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}