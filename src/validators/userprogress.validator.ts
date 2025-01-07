import * as v from "valibot";

export const UserProgressSchema = v.object({
  userId: v.string(),
  completedQuestions: v.array(v.string()),
  starredQuestions: v.array(v.string()),
  lastUpdated: v.date(),
});

export type UserProgress = v.InferInput<typeof UserProgressSchema>;
