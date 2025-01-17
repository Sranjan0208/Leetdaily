export interface Problem {
  id: string;
  title: string;
  questionLink: string;
  difficulty: "Easy" | "Medium" | "Hard";
  paidOnly: boolean;
  starred: boolean;
  completed: boolean;
  date?: string;
}
