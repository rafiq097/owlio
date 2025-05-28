"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, LogOut } from "lucide-react"
import { signOut } from "@/auth"
import LogoutButton from "./LogoutButton"

export default function Navbar({ user }) {
  const [state, setState] = useState(false)

  return (
    <nav className="bg-gray-900 w-full border-b border-gray-700 md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-100 hover:text-blue-400 transition-colors">Owl</h1>
          </Link>

          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-gray-100 outline-none p-2 rounded-md focus:border-gray-600 focus:border bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>

        <div
          className={`${state ? "block" : "hidden"
            } md:block md:justify-end flex-1 pb-3 mt-8 md:pb-0 md:mt-0`}
        >
          <ul className="flex flex-col md:flex-row justify-end space-y-6 md:space-x-6 md:space-y-0">
            <li className="text-gray-300 hover:text-blue-400 transition-colors">
              <Link href="/">Home</Link>
            </li>
            <li className="text-gray-300 hover:text-blue-400 transition-colors">
              <Link href="/xplore">Xplore</Link>
            </li>
            <li className="text-gray-300 hover:text-blue-400 transition-colors">
              <Link href="/profile">Profiles</Link>
            </li>
            {user?.email == process.env.NEXT_PUBLIC_ADMIN &&
              <li className="text-gray-300 hover:text-blue-400 transition-colors">
                <Link href="/admin">Admin</Link>
              </li>}
            {user && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}