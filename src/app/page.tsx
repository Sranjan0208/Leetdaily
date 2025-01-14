"use client";
import React, { useState, useEffect } from "react";
import {
  Brain,
  Target,
  Trophy,
  Sparkles,
  Code,
  Users,
  Zap,
  Mail,
  Github,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -inset-[10px] opacity-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="animate-gradient-x absolute h-[20px] w-[500px] rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 opacity-20 blur-3xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  </div>
);

const GlowingCard = ({ children }) => (
  <div className="group relative rounded-xl bg-gray-800/50 p-1">
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur transition-opacity duration-500 group-hover:opacity-30" />
    {children}
  </div>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="flex flex-col items-center space-y-2 rounded-lg bg-gray-800/50 p-6 text-center">
    <Icon className="h-8 w-8 text-indigo-400" />
    <span className="text-4xl font-bold text-white">{number}</span>
    <span className="text-sm text-gray-400">{label}</span>
  </div>
);

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      <BackgroundAnimation />

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 sm:px-8 lg:px-10">
        <div className="space-y-8 text-center">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-extrabold leading-tight text-transparent md:text-7xl">
              Master Your Coding Skills
              <span className="block text-4xl md:text-5xl">
                One Problem at a Time 🚀
              </span>
            </h1>
          </div>

          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Elevate your problem-solving abilities with daily challenges,
            progress tracking, and achievements ✨
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signin"
              className="group relative inline-block cursor-pointer rounded-xl bg-gray-800 p-px font-semibold leading-6 text-white shadow-2xl shadow-purple-900/20 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-purple-900/40 active:scale-95"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 block rounded-xl bg-gray-900 px-8 py-4">
                <div className="flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <Sparkles className="h-5 w-5" />
                </div>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto mb-20 grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-4 sm:px-8 lg:px-10">
        <StatCard number="1000+" label="Daily Users" icon={Users} />
        <StatCard number="500+" label="Challenges" icon={Code} />
        <StatCard number="50+" label="Languages" icon={Zap} />
        <StatCard number="10k+" label="Solutions" icon={Trophy} />
      </div>

      {/* Bento Grid Features */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 sm:px-8 md:grid-cols-3 lg:px-10">
        {/* Feature 1 - Larger Card */}
        <div className="md:col-span-2">
          <GlowingCard>
            <div className="relative rounded-xl bg-gray-900 p-8">
              <div className="flex items-center space-x-4">
                <Target className="h-14 w-14 text-indigo-400" />
                <h3 className="text-2xl font-bold text-gray-100">
                  Daily Challenges
                </h3>
              </div>
              <p className="mt-4 text-gray-400">
                New coding problems every day to keep your skills sharp and your
                mind engaged. With progressive difficulty levels and varied
                topics.
              </p>
            </div>
          </GlowingCard>
        </div>

        {/* Feature 2 */}
        <div>
          <GlowingCard>
            <div className="relative rounded-xl bg-gray-900 p-8">
              <div className="flex items-center space-x-4">
                <Brain className="h-8 w-8 text-indigo-400" />
                <h3 className="text-xl font-bold text-gray-100">
                  Learn & Grow
                </h3>
              </div>
              <p className="mt-4 text-gray-400">
                Track your progress and watch your problem-solving skills
                improve over time.
              </p>
            </div>
          </GlowingCard>
        </div>

        {/* Feature 3 */}
        <div>
          <GlowingCard>
            <div className="relative rounded-xl bg-gray-900 p-8">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-indigo-400" />
                <h3 className="text-xl font-bold text-gray-100">
                  Achievements
                </h3>
              </div>
              <p className="mt-4 text-gray-400">
                Earn badges and trophies as you complete challenges and
                milestones.
              </p>
            </div>
          </GlowingCard>
        </div>

        {/* Feature 4 - Larger Card */}
        <div className="md:col-span-2">
          <GlowingCard>
            <div className="relative rounded-xl bg-gray-900 p-8">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-indigo-400" />
                <h3 className="text-2xl font-bold text-gray-100">
                  Community Driven
                </h3>
              </div>
              <p className="mt-4 text-gray-400">
                Join a thriving community of developers. Share solutions,
                discuss approaches, and learn from peers around the world.
              </p>
            </div>
          </GlowingCard>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">LeetDaily</h3>
              <p className="text-sm text-gray-400">
                Empowering developers to master their craft through daily
                practice and continuous learning.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Premium
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LeetDaily. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
