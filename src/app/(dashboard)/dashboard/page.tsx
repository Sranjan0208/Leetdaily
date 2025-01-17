"use client";
import React, { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Problem } from "@/types/problem";
import axios from "axios";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

function MessageLoading() {
  return (
    <div className="flex h-screen max-h-screen items-center justify-center bg-gray-900">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <circle cx="4" cy="12" r="2" fill="currentColor">
          <animate
            id="spinner_qFRN"
            begin="0;spinner_OcgL.end+0.25s"
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
        <circle cx="12" cy="12" r="2" fill="currentColor">
          <animate
            begin="spinner_qFRN.begin+0.1s"
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
        <circle cx="20" cy="12" r="2" fill="currentColor">
          <animate
            id="spinner_OcgL"
            begin="spinner_qFRN.begin+0.2s"
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
      </svg>
    </div>
  );
}

const Dashboard = () => {
  const [dailyProblems, setDailyProblems] = useState<Problem[]>([]);
  const [starredProblems, setStarredProblems] = useState<Problem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "starred" | "completed">(
    "daily",
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [dailyResponse, progressResponse] = await Promise.all([
        axios.get<{ dailyQuestions: Problem[] }>(
          "https://calm-cat-1a4b88.netlify.app/api/questions/daily-questions",
        ),
        axios.get<{
          completedQuestions: Problem[];
          starredQuestions: Problem[];
        }>("https://calm-cat-1a4b88.netlify.app/api/questions/user-progress"),
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
        "https://calm-cat-1a4b88.netlify.app/api/questions/daily-questions?refresh=true",
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

  const updateProblemInAllLists = (
    id: string,
    updates: Partial<Problem>,
    removeFromStarred = false,
    removeFromCompleted = false,
  ) => {
    const updateList = (problems: Problem[]) =>
      problems.map((p) => (p.id === id ? { ...p, ...updates } : p));

    // Always update daily problems
    setDailyProblems((prev) => updateList(prev));

    // Handle starred problems
    if (removeFromStarred) {
      setStarredProblems((prev) => prev.filter((p) => p.id !== id));
    } else {
      setStarredProblems((prev) => {
        // Only update if the problem already exists in the list
        if (prev.some((p) => p.id === id)) {
          return updateList(prev);
        }
        return prev;
      });
    }

    // Handle completed problems
    if (removeFromCompleted) {
      setCompletedProblems((prev) => prev.filter((p) => p.id !== id));
    } else {
      setCompletedProblems((prev) => {
        // Only update if the problem already exists in the list
        if (prev.some((p) => p.id === id)) {
          return updateList(prev);
        }
        return prev;
      });
    }
  };

  const toggleStar = async (id: string) => {
    if (pendingUpdates.has(id)) {
      return;
    }

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      const problem =
        dailyProblems.find((p) => p.id === id) ||
        starredProblems.find((p) => p.id === id) ||
        completedProblems.find((p) => p.id === id);

      if (!problem) return;

      const isCurrentlyStarred = problem.starred;

      // Optimistic update for all lists
      updateProblemInAllLists(
        id,
        { starred: !isCurrentlyStarred },
        isCurrentlyStarred, // remove from starred if currently starred
      );

      // Additionally, if we're starring (not unstarring), add to starred list
      if (!isCurrentlyStarred) {
        setStarredProblems((prev) => [...prev, { ...problem, starred: true }]);
      }

      // Show appropriate toast
      if (isCurrentlyStarred) {
        toast("Question unstarred!");
      } else {
        toast.success(
          "Question Starred! It will be sent again at the end of the week to revise.",
        );
      }

      // Make API call
      await axios.post(
        `https://calm-cat-1a4b88.netlify.app/api/questions/${id}/star`,
      );
    } catch (err) {
      console.error("Error toggling star:", err);
      toast.error("Failed to update star status. Refreshing data...");
      await fetchAllData(); // Refresh all data to ensure consistency
    } finally {
      setPendingUpdates((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  const toggleComplete = async (id: string) => {
    if (pendingUpdates.has(id)) {
      return;
    }

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      const problem =
        dailyProblems.find((p) => p.id === id) ||
        starredProblems.find((p) => p.id === id) ||
        completedProblems.find((p) => p.id === id);

      if (!problem) return;

      const isCurrentlyCompleted = problem.completed;

      // Optimistic update for all lists
      updateProblemInAllLists(
        id,
        { completed: !isCurrentlyCompleted },
        false, // don't remove from starred
        isCurrentlyCompleted, // remove from completed if currently completed
      );

      // Additionally, if we're completing (not uncompleting), add to completed list
      if (!isCurrentlyCompleted) {
        setCompletedProblems((prev) => [
          ...prev,
          { ...problem, completed: true },
        ]);
      }

      // Show appropriate toast
      toast(
        isCurrentlyCompleted
          ? "Question unmarked as complete!"
          : "Question marked as complete!",
      );

      // Make API call
      await axios.post(
        `https://calm-cat-1a4b88.netlify.app/api/questions/${id}/complete`,
      );
    } catch (err) {
      console.error("Error toggling complete:", err);
      toast.error("Failed to update completion status. Refreshing data...");
      await fetchAllData(); // Refresh all data to ensure consistency
    } finally {
      setPendingUpdates((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  const getCurrentProblems = () => {
    const problems = (() => {
      switch (activeTab) {
        case "starred":
          return starredProblems;
        case "completed":
          return completedProblems;
        default:
          return dailyProblems;
      }
    })();

    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return problems.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const totalItems = (() => {
      switch (activeTab) {
        case "starred":
          return starredProblems.length;
        case "completed":
          return completedProblems.length;
        default:
          return dailyProblems.length;
      }
    })();

    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const PaginationControls = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    const getVisiblePages = () => {
      if (totalPages <= 5) return pages;

      if (currentPage <= 3) return pages.slice(0, 5);
      if (currentPage >= totalPages - 2) return pages.slice(-5);

      return pages.slice(currentPage - 2, currentPage + 1);
    };

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {showEllipsisStart && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {getVisiblePages().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
                isActive={currentPage === page}
                className={currentPage === page ? "text-black" : "c"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEllipsisEnd && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (loading) {
    return <MessageLoading />;
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
      <PaginationControls />
    </div>
  );
};

export default Dashboard;
