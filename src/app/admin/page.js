"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, User, UserCog, Award, Code, Clock, Grid3x3 } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const displayFriends = (friends) => {
    if (!friends || friends.length === 0) {
      return <span className="text-slate-400 italic text-sm">No friends yet</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5 max-w-xs">
        {friends.map((friend, idx) => (
          <span
            key={idx}
            className="bg-gray-50 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 flex items-center"
          >
            <User size={10} className="mr-1 flex-shrink-0" />
            <span>{friend}</span>
          </span>
        ))}
      </div>
    );
  };

  const displayTimes = (times) => {
    if (!times || times.length === 0) {
      return <span className="text-slate-400 italic text-sm">No times set</span>;
    }

    return (
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1">
          {times.slice(0, 2).map((time, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-blue-700 text-xs font-mono px-2 py-1 rounded-md border border-blue-200 flex items-center"
            >
              <Clock size={10} className="mr-1 flex-shrink-0" />
              {time}
            </span>
          ))}
        </div>
        {times.length > 2 && (
          <div className="flex flex-wrap gap-1">
            {times.slice(2, 4).map((time, idx) => (
              <span
                key={idx + 2}
                className="bg-blue-50 text-blue-700 text-xs font-mono px-2 py-1 rounded-md border border-blue-200 flex items-center"
              >
                <Clock size={10} className="mr-1 flex-shrink-0" />
                {time}
              </span>
            ))}
            {times.length > 4 && (
              <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md">
                +{times.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Profiles</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(user => user.leetcode || user.codechef).length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Code className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">With Friends</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(user => user.friends && user.friends.length > 0).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="block lg:hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {users.map((user, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-900 truncate">{user.email}</span>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1.5 flex items-center">
                          <Clock size={12} className="mr-1" />
                          Times
                        </p>
                        {displayTimes(user.times)}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-1 flex items-center">
                            <Code size={12} className="mr-1" />
                            LeetCode
                          </p>
                          <span className="text-sm text-slate-700">
                            {user.leetcode || <span className="text-slate-400 italic">Not set</span>}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-1 flex items-center">
                            <Award size={12} className="mr-1" />
                            CodeChef
                          </p>
                          <span className="text-sm text-slate-700">
                            {user.codechef || <span className="text-slate-400 italic">Not set</span>}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1.5 flex items-center">
                          <Users size={12} className="mr-1" />
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

          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User size={14} className="mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2" />
                      Times
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Code size={14} className="mr-2" />
                      LeetCode
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Award size={14} className="mr-2" />
                      CodeChef
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users size={14} className="mr-2" />
                      Friends
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">No users found</p>
                      <p className="text-slate-400 text-sm">Users will appear here once they register</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-900">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                        {displayTimes(user.times)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {user.leetcode ? (
                          <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium border border-yellow-200">
                            {user.leetcode}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {user.codechef ? (
                          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium border border-orange-200">
                            {user.codechef}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                        {displayFriends(user.friends)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 space-y-2 sm:space-y-0">
              <span>Showing {users.length} user{users.length !== 1 ? 's' : ''}</span>
              <span className="text-right">Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}