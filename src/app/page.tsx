import { Brain, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  console.log("Reaching Home");
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 sm:px-8 lg:px-10">
        <div className="space-y-6 text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-6xl font-extrabold leading-tight text-transparent">
            Master Your Coding Skills
            <br />
            One Problem at a Time
          </h1>
          <p className="text-xl text-gray-400">
            Elevate your problem-solving abilities with daily challenges,
            progress tracking, and achievements.
          </p>
          <Link
            href="/auth/signin"
            className="group relative inline-block cursor-pointer rounded-xl bg-gray-800 p-px font-semibold leading-6 text-white shadow-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10 block rounded-xl bg-gray-950 px-6 py-3">
              <div className="relative z-10 flex items-center space-x-2">
                <span className="transition-all duration-500 group-hover:translate-x-1">
                  Start Solving
                </span>
                <svg
                  className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1"
                  data-slot="icon"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-3 grid max-w-6xl grid-cols-1 gap-10 px-6 sm:px-8 md:grid-cols-3 lg:px-10">
        {/* Feature 1 */}
        <div className="relative rounded-lg bg-gray-800 p-8 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-20 blur-xl"></div>
          <div className="relative flex items-center space-x-4">
            <div className="rounded-lg bg-gray-900 p-4">
              <Target className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-100">
              Daily Challenges
            </h3>
          </div>
          <p className="mt-4 text-gray-400">
            New coding problems every day to keep your skills sharp and your
            mind engaged.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="relative rounded-lg bg-gray-800 p-8 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-20 blur-xl"></div>
          <div className="relative flex items-center space-x-4">
            <div className="rounded-lg bg-gray-900 p-4">
              <Brain className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-100">Learn & Grow</h3>
          </div>
          <p className="mt-4 text-gray-400">
            Track your progress and watch your problem-solving skills improve
            over time.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="relative rounded-lg bg-gray-800 p-8 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-20 blur-xl"></div>
          <div className="relative flex items-center space-x-4">
            <div className="rounded-lg bg-gray-900 p-4">
              <Trophy className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-100">
              Achievement System
            </h3>
          </div>
          <p className="mt-4 text-gray-400">
            Star your favorite problems and track your completed challenges.
          </p>
        </div>
      </div>
    </div>
  );
}
