"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { getApiUrl } from "@/lib/config";

const ITEMS_PER_PAGE = 6;
const BATCH_INTERVAL = 2500;

type BatchOperation = {
  id: string;
  type: "star" | "complete";
  value: boolean;
};

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
  const [currentPage, setCurrentPage] = useState(1);

  // Batch Operations Queue
  const [pendingOperations, setPendingOperations] = useState<BatchOperation[]>(
    [],
  ); // Storing queue operations
  const [processingBatch, setProcessingBatch] = useState(false); // Prevents multiple batches from running simultaneously.

  useEffect(() => {
    fetchAllData();
  }, []);

  // Process batch operations

  useEffect(() => {
    let batchTimeout: NodeJS.Timeout;

    const processBatch = async () => {
      if (processingBatch || pendingOperations.length === 0) return;

      setProcessingBatch(true);
      const currentBatch = [...pendingOperations];
      setPendingOperations([]);

      try {
        // Process all operations in a single request
        await axios.post(getApiUrl("/questions/batch-operations"), {
          operations: currentBatch,
        });

        toast.success("Updates processed successfully!");
      } catch (error) {
        console.error("Batch operation failed:", error);
        toast.error("Failed to process updates. Refreshing data...");
        await fetchAllData();
      } finally {
        setProcessingBatch(false);
      }
    };

    if (pendingOperations.length > 0) {
      batchTimeout = setTimeout(processBatch, BATCH_INTERVAL);
    }

    return () => clearTimeout(batchTimeout);
  }, [pendingOperations, processingBatch]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dailyResponse, progressResponse] = await Promise.all([
        axios.get<{ success: boolean; dailyQuestions: Problem[] }>(
          getApiUrl("/questions/daily-questions"),
        ),
        axios.get<{
          completedQuestions: Problem[];
          starredQuestions: Problem[];
        }>(getApiUrl("/questions/user-progress")),
      ]);

      // Ensure we have the daily questions data
      if (!dailyResponse.data.success || !dailyResponse.data.dailyQuestions) {
        throw new Error("Failed to fetch daily questions");
      }

      // Ensure we have arrays even if the response is empty
      const starredQuestions = progressResponse.data.starredQuestions || [];
      const completedQuestions = progressResponse.data.completedQuestions || [];

      // Create sets for efficient lookup
      const starredIds = new Set(starredQuestions.map((q) => q.id));
      const completedIds = new Set(completedQuestions.map((q) => q.id));

      // Update daily problems
      setDailyProblems(
        dailyResponse.data.dailyQuestions.map((problem) => ({
          ...problem,
          starred: starredIds.has(problem.id),
          completed: completedIds.has(problem.id),
        })),
      );

      // Update starred problems
      setStarredProblems(
        starredQuestions.map((problem) => ({
          ...problem,
          starred: true,
          completed: completedIds.has(problem.id),
        })),
      );

      // Update completed problems
      setCompletedProblems(
        completedQuestions.map((problem) => ({
          ...problem,
          completed: true,
          starred: starredIds.has(problem.id),
        })),
      );

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  const refreshQuestions = async () => {
    setRefreshing(true);
    try {
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(7);

      const response = await axios.get<{
        success: boolean;
        dailyQuestions: Problem[];
      }>(
        getApiUrl(
          `/questions/daily-questions?refresh=true&t=${timestamp}&nonce=${randomString}`,
        ),
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            // Force Fresh Data
            "If-None-Match": "",
            "If-Modified-Since": "",
          },
          // Disable axios caching
          withCredentials: false,
          timeout: 30000,
          // Prevent Browser Caching
          params: {
            _: timestamp,
          },
        },
      );

      if (!response.data.success || !response.data.dailyQuestions) {
        throw new Error("Failed to refresh questions");
      }

      // Clear existing problems and set new ones
      setDailyProblems(
        response.data.dailyQuestions.map((problem) => ({
          ...problem,
          starred: false,
          completed: false,
        })),
      );

      toast.success("Questions refreshed successfully!");
    } catch (err) {
      console.error("Error refreshing questions:", err);
      toast.error("Failed to refresh questions");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleStar = useCallback(
    (id: string) => {
      const problem = [
        ...dailyProblems,
        ...starredProblems,
        ...completedProblems,
      ].find((p) => p.id === id);

      if (!problem) return;

      const newValue = !problem.starred;

      // Optimistic update
      updateProblemInAllLists(id, { starred: newValue });

      // Add to batch queue
      setPendingOperations((prev) => [
        ...prev,
        { id, type: "star", value: newValue },
      ]);
    },
    [dailyProblems, starredProblems, completedProblems],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const problem = [
        ...dailyProblems,
        ...starredProblems,
        ...completedProblems,
      ].find((p) => p.id === id);

      if (!problem) return;

      const newValue = !problem.completed;

      // Optimistic update
      updateProblemInAllLists(id, { completed: newValue });

      // Add to batch queue
      setPendingOperations((prev) => [
        ...prev,
        { id, type: "complete", value: newValue },
      ]);
    },
    [dailyProblems, starredProblems, completedProblems],
  );

  const updateProblemInAllLists = useCallback(
    (id: string, updates: Partial<Problem>) => {
      const updateList = (problems: Problem[]) =>
        problems.map((p) => (p.id === id ? { ...p, ...updates } : p));

      setDailyProblems(updateList);
      setStarredProblems((prev) => {
        const isStarred =
          updates.starred ?? prev.some((p) => p.id === id && p.starred);
        if (!isStarred) {
          return prev.filter((p) => p.id !== id);
        }
        return updateList(prev);
      });
      setCompletedProblems((prev) => {
        const isCompleted =
          updates.completed ?? prev.some((p) => p.id === id && p.completed);
        if (!isCompleted) {
          return prev.filter((p) => p.id !== id);
        }
        return updateList(prev);
      });
    },
    [],
  );

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
