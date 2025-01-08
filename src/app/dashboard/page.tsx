"use client";
import React, { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Problem } from "@/types/problem";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "starred" | "completed">(
    "daily",
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get<{ dailyQuestions: Problem[] }>(
          "http://localhost:3000/api/questions/daily-questions",
        );
        setProblems(response.data.dailyQuestions);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    fetchProblems();
  }, []);

  const refreshQuestions = async () => {
    setRefreshing(true);
    try {
      await axios.post("http://localhost:3000/api/questions/refresh");
      const response = await axios.get<{ dailyQuestions: Problem[] }>(
        "http://localhost:3000/api/questions/daily-questions",
      );
      setProblems(response.data.dailyQuestions);
    } catch (err) {
      console.error("Error refreshing questions:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleStar = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/api/questions/${id}/star`);
      setProblems(
        problems.map((problem) =>
          problem.id === id
            ? { ...problem, starred: !problem.starred }
            : problem,
        ),
      );
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/api/questions/${id}/complete`);
      setProblems(
        problems.map((problem) =>
          problem.id === id
            ? { ...problem, completed: !problem.completed }
            : problem,
        ),
      );
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    switch (activeTab) {
      case "starred":
        return problem.starred;
      case "completed":
        return problem.completed;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-indigo-500"></div>
          <p className="text-lg">Loading Problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl min-h-screen w-full bg-gray-900 px-6 py-12 text-white">
      <div className="mb-6">
        <h1 className="mb-4 text-4xl font-extrabold">Problem Dashboard</h1>
        <div className="flex space-x-4">
          {["daily", "starred", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`rounded-full px-5 py-2 text-sm font-medium shadow-md transition-all ${
                activeTab === tab
                  ? "border border-gray-600 bg-gradient-to-r from-gray-800 to-black text-white duration-200 hover:scale-105 hover:border-gray-800 hover:from-black hover:to-gray-900 hover:text-gray-500"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={refreshQuestions}
          className={`flex items-center space-x-2 rounded-full px-5 py-2 text-sm font-semibold shadow-md transition-all ${
            refreshing
              ? "cursor-not-allowed bg-gray-600 text-gray-400"
              : "border border-gray-600 bg-gradient-to-r from-gray-800 to-black text-white duration-200 hover:scale-105 hover:border-gray-800 hover:from-black hover:to-gray-900 hover:text-gray-500"
          }`}
          disabled={refreshing}
        >
          {refreshing ? (
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              ></path>
            </svg>
          ) : (
            "Refresh Questions"
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            onToggleStar={toggleStar}
            onToggleComplete={toggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
