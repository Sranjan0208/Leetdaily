"use client";
import React, { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Problem } from "@/types/problem";
import axios from "axios";
import { toast } from "sonner";

const Dashboard = () => {
  const [dailyProblems, setDailyProblems] = useState<Problem[]>([]);
  const [starredProblems, setStarredProblems] = useState<Problem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "starred" | "completed">(
    "daily",
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [dailyResponse, progressResponse] = await Promise.all([
        axios.get<{ dailyQuestions: Problem[] }>(
          "http://localhost:3000/api/questions/daily-questions",
        ),
        axios.get<{
          completedQuestions: Problem[];
          starredQuestions: Problem[];
        }>("http://localhost:3000/api/questions/user-progress"),
      ]);

      // Create sets of starred and completed question IDs for easy lookup
      const starredIds = new Set(
        progressResponse.data.starredQuestions.map((q) => q.id),
      );
      const completedIds = new Set(
        progressResponse.data.completedQuestions.map((q) => q.id),
      );

      // Update daily problems with correct starred and completed states
      const updatedDailyProblems = dailyResponse.data.dailyQuestions.map(
        (problem) => ({
          ...problem,
          starred: starredIds.has(problem.id),
          completed: completedIds.has(problem.id),
        }),
      );

      // Mark starred and completed properties in the respective lists
      const updatedStarredProblems = progressResponse.data.starredQuestions.map(
        (problem) => ({
          ...problem,
          starred: true,
          completed: completedIds.has(problem.id),
        }),
      );

      const updatedCompletedProblems =
        progressResponse.data.completedQuestions.map((problem) => ({
          ...problem,
          completed: true,
          starred: starredIds.has(problem.id),
        }));

      setDailyProblems(updatedDailyProblems);
      setStarredProblems(updatedStarredProblems);
      setCompletedProblems(updatedCompletedProblems);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const refreshQuestions = async () => {
    setRefreshing(true);
    try {
      // Fetch new questions
      const response = await axios.get<{ dailyQuestions: Problem[] }>(
        "http://localhost:3000/api/questions/daily-questions?refresh=true",
      );

      // Get current starred and completed states
      const starredIds = new Set(starredProblems.map((q) => q.id));
      const completedIds = new Set(completedProblems.map((q) => q.id));

      // Update daily problems with correct starred and completed states
      const updatedDailyProblems = response.data.dailyQuestions.map(
        (problem) => ({
          ...problem,
          starred: starredIds.has(problem.id),
          completed: completedIds.has(problem.id),
        }),
      );

      setDailyProblems(updatedDailyProblems);
      toast("Daily questions refreshed successfully!"); // Consider using a toast notification instead
    } catch (err) {
      console.error("Error refreshing questions:", err);
      toast("Failed to refresh questions. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleStar = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/api/questions/${id}/star`);

      // Get the problem from either daily problems or starred problems
      const problem =
        dailyProblems.find((p) => p.id === id) ||
        starredProblems.find((p) => p.id === id);

      if (!problem) return;

      const isCurrentlyStarred = starredProblems.some((p) => p.id === id);

      // Update daily problems if the problem exists there
      setDailyProblems((prevProblems) =>
        prevProblems.map((p) =>
          p.id === id ? { ...p, starred: !isCurrentlyStarred } : p,
        ),
      );

      // Update starred problems
      if (isCurrentlyStarred) {
        // Remove from starred problems
        setStarredProblems((prev) => prev.filter((p) => p.id !== id));
        toast("Question unstarred!");
      } else {
        // Add to starred problems
        setStarredProblems((prev) => [...prev, { ...problem, starred: true }]);
        toast.success(
          "Question Starred! It will be sent again at the end of the week to revise.",
        );
      }

      // Refresh data to ensure everything is in sync
      await fetchAllData();
    } catch (err) {
      console.error("Error toggling star:", err);
      await fetchAllData();
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      // Check if the question is currently marked as completed
      const isCurrentlyCompleted = completedProblems.some((p) => p.id === id);

      // Optimistically update the state for dailyProblems
      setDailyProblems((prevProblems) =>
        prevProblems.map((p) =>
          p.id === id ? { ...p, completed: !isCurrentlyCompleted } : p,
        ),
      );

      // Optimistically update the state for completedProblems
      if (isCurrentlyCompleted) {
        // Remove from completed problems
        setCompletedProblems((prev) => prev.filter((p) => p.id !== id));
        toast("Question unmarked as complete!");
      } else {
        // Find the problem in dailyProblems or starredProblems
        const problem =
          dailyProblems.find((p) => p.id === id) ||
          starredProblems.find((p) => p.id === id);

        if (problem) {
          setCompletedProblems((prev) => [
            ...prev,
            { ...problem, completed: true },
          ]);
        }
        toast("Question marked as complete!");
      }

      // Call the API to toggle completion status
      await axios.post(`http://localhost:3000/api/questions/${id}/complete`);
    } catch (err) {
      console.error("Error toggling complete:", err);

      // If an error occurs, refresh to ensure consistency
      await fetchAllData();
    }
  };

  const getCurrentProblems = () => {
    switch (activeTab) {
      case "starred":
        return starredProblems;
      case "completed":
        return completedProblems;
      default:
        return dailyProblems;
    }
  };

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
        {getCurrentProblems().map((problem) => (
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
