"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, User, UserCog, Award, Code } from "lucide-react";

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const display = (friends) => {
    if (!friends || friends.length === 0) {
      return <span className="text-gray-400 italic">None</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {friends.map((friend, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center"
          >
            <User size={12} className="mr-1" />
            {friend}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    Email
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <UserCog size={14} className="mr-1" />
                    Times
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Code size={14} className="mr-1" />
                    LeetCode
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Award size={14} className="mr-1" />
                    CodeChef
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    Friends
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.times && user.times.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1">
                          {user.times.map((time, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.leetcode || <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.codechef || <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {display(user.friends)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-right text-gray-500">
          Total users: {users.length}
        </div>
      </div>
    </div>
  );
}