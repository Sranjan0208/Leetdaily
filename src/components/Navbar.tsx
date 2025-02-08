"use client";
import { Code2, Home, User, Settings, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-gray-900" />

      <div className="max-w-8xl relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              <Code2 className="relative h-8 w-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-2xl font-extrabold text-transparent">
              LeetDaily
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* AI Tutor Button */}
                <Link
                  href={
                    pathname === "/dashboard/tutor"
                      ? "/dashboard"
                      : "/dashboard/tutor"
                  }
                  className="group relative inline-flex items-center rounded-xl bg-gray-800 p-px font-medium text-white transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center space-x-2 rounded-xl bg-gray-900 px-4 py-2 text-sm transition-colors group-hover:bg-gray-900/50">
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <span>
                      {pathname === "/dashboard/tutor"
                        ? "Dashboard"
                        : "Go to AI Tutor"}
                    </span>
                  </span>
                </Link>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group relative focus:outline-none">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:blur-sm" />
                      <Avatar className="relative h-10 w-10 cursor-pointer border-2 border-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:border-transparent">
                        <AvatarImage
                          src={session?.user?.image ?? ""}
                          alt={session?.user?.name ?? "User avatar"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                          {session?.user?.name ? (
                            session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 p-1 shadow-2xl"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-100">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuGroup>
                      <Link
                        href={
                          isDashboard ? "/dashboard/settings" : "/dashboard"
                        }
                      >
                        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-gray-200 transition-colors hover:bg-gray-800">
                          {isDashboard ? (
                            <>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>{" "}
                            </>
                          ) : (
                            <>
                              <Home className="mr-2 h-4 w-4" />
                              <span>Dashboard</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="group relative inline-flex items-center rounded-xl bg-gray-800 p-px font-medium text-white transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative rounded-xl bg-gray-900 px-4 py-2 text-sm transition-colors group-hover:bg-gray-900/50">
                  Sign In
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
