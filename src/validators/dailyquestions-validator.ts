import * as v from "valibot";

export const DailyQuestionsSchema = v.object({
  userId: v.string(),
  questions: v.array(v.string()),
  lastUpdated: v.date(),
});

export type DailyQuestions = v.InferInput<typeof DailyQuestionsSchema>;
