"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, LogOut } from "lucide-react"
import { signOut } from "@/auth"
import LogoutButton from "./LogoutButton"

export default function Navbar({ user }) {
  const [state, setState] = useState(false)

  return (
    <nav className="bg-white w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-black-100">Owl</h1>
          </Link>

          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
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
            <li className="text-gray-600 hover:text-black-600">
              <Link href="/">Home</Link>
            </li>
            <li className="text-gray-600 hover:text-black-600">
              <Link href="/xplore">Xplore</Link>
            </li>
            <li className="text-gray-600 hover:text-blue-600">
              <Link href="/profile">Profiles</Link>
            </li>
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
