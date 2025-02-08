export interface Question {
  question: string;
  expectedKeyPoints: string[];
  difficulty: "junior" | "mid" | "senior";
  category:
    | "system-design"
    | "problem-solving"
    | "implementation"
    | "architecture";
  commonAt?: string[];
}

export interface Evaluation {
  score: number;
  feedback: string;
  improvements: string[];
  strengths: string[];
  interviewerNotes?: string;
}

export type ExperienceLevel = "junior" | "mid" | "senior";

export type Topic =
  | "DBMS"
  | "Operating Systems"
  | "Computer Networking"
  | "JavaScript"
  | "Node.js";
