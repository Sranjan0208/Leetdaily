"use client";
import { Code2, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black shadow-lg">
      <div className="max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center">
            <Code2 className="h-8 w-8 text-indigo-400" />
            <span className="ml-3 text-2xl font-extrabold text-gray-100">
              LeetDaily
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                pathname === "/"
                  ? "bg-indigo-600 text-gray-100"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              } flex items-center`}
            >
              <Home className="mr-2 inline-block h-5 w-5" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                pathname === "/dashboard"
                  ? "bg-indigo-600 text-gray-100"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
