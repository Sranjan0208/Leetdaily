import * as v from "valibot";

export const QuestionsSchema = v.object({
  questionId: v.string(),
  title: v.string(),
  questionLink: v.string(),
  difficulty: v.string(),
});

export type Questions = v.InferInput<typeof QuestionsSchema>;
