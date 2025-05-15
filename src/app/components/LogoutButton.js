"use client"

import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/auth/csrf")
      const data = await res.json()
      setCsrfToken(data.csrfToken)
    }
    fetchToken()
  }, [])

  if (!csrfToken) return null

  return (
    <form method="POST" action="/api/auth/signout">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <button
        type="submit"
        className="flex items-center gap-2 text-gray-700 hover:text-red-800 font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </form>
  )
}
