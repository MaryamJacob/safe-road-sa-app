"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-2 p-4">
      <button onClick={() => setTheme("light")} className="p-2 border rounded bg-gray-200 dark:bg-gray-700">Light</button>
      <button onClick={() => setTheme("dark")} className="p-2 border rounded bg-gray-200 dark:bg-gray-700">Dark</button>
      <button onClick={() => setTheme("system")} className="p-2 border rounded bg-gray-200 dark:bg-gray-700">System</button>
    </div>
  )
}
