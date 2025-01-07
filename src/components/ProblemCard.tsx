import { Star, CheckCircle2 } from "lucide-react";
import { Problem } from "../types/problem";
import { cn } from "../lib/utils";

interface ProblemCardProps {
  problem: Problem;
  onToggleStar: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onToggleStar,
  onToggleComplete,
}) => {
  const difficultyColor: Record<"Easy" | "Medium" | "Hard", string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-700 bg-gray-800 p-6 text-white shadow-lg transition-shadow hover:shadow-xl">
      {/* Title and Difficulty */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{problem.title}</h3>
            <span
              className={`text-sm font-medium ${
                difficultyColor[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleStar(problem.id)}
              className={cn(
                "rounded-full p-2 transition-all hover:bg-gray-700",
                problem.starred ? "text-yellow-400" : "text-gray-400",
              )}
            >
              <Star
                className="h-5 w-5"
                fill={problem.starred ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => onToggleComplete(problem.id)}
              className={cn(
                "rounded-full p-2 transition-all hover:bg-gray-700",
                problem.completed ? "text-green-400" : "text-gray-400",
              )}
            >
              <CheckCircle2
                className="h-5 w-5"
                fill={problem.completed ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* View Button */}
      <div className="mt-4 flex items-center">
        <button
          onClick={() => window.open(problem.link, "_blank")}
          className="group relative inline-block cursor-pointer rounded-full bg-gray-800 p-px font-semibold leading-6 text-white shadow-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10 block rounded-full border border-gray-600 bg-gradient-to-r from-gray-800 to-black px-4 py-2 text-white">
            <div className="relative z-10 flex items-center space-x-2">
              <span className="transition-all duration-500 group-hover:translate-x-1">
                Solve
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
        </button>
      </div>

      {/* Date */}
      {problem.date && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Daily Challenge: {problem.date}
        </p>
      )}
    </div>
  );
};
