"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Send,
  RefreshCw,
  Brain,
  GraduationCap,
  Building2,
  Timer,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
  Trophy,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Topic,
  Question,
  Evaluation,
  ExperienceLevel,
} from "@/types/tutor-problem";
import { getApiUrl } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const topics: Topic[] = [
  "Computer Networking",
  "DBMS",
  "Operating Systems",
  "JavaScript",
  "Node.js",
];

const experienceLevels = {
  junior: {
    label: "Junior Level",
    icon: Users,
    color: "text-green-500",
    borderColor: "border-green-500",
    description: "0-2 years experience",
  },
  mid: {
    label: "Mid Level",
    icon: Trophy,
    color: "text-yellow-500",
    borderColor: "border-yellow-500",
    description: "2-5 years experience",
  },
  senior: {
    label: "Senior Level",
    icon: Building2,
    color: "text-purple-500",
    borderColor: "border-purple-500",
    description: "5+ years experience",
  },
};

const QuestionSkeleton = () => (
  <div className="rounded-xl bg-[#1E293B] p-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  </div>
);

interface QuestionCardProps {
  question: string;
  topic: Topic;
  level: ExperienceLevel;
  onNewQuestion: () => void;
  loadingQuestion: boolean;
}

const QuestionCard = ({
  question,
  topic,
  level,
  onNewQuestion,
  loadingQuestion,
}: QuestionCardProps) => {
  const levelInfo = experienceLevels[level];
  const LevelIcon = levelInfo.icon;

  return (
    <div className="rounded-xl bg-[#1E293B] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge className="bg-[#4F46E5] text-white hover:bg-[#4338CA]">
            {topic}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className={`${levelInfo.borderColor} ${levelInfo.color}`}
                >
                  <LevelIcon className="mr-1.5 h-3 w-3" />
                  {levelInfo.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{levelInfo.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onNewQuestion}
          disabled={loadingQuestion}
          className="text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loadingQuestion ? "animate-spin" : ""}`}
          />
          New Question
        </Button>
      </div>
      <p className="text-lg font-medium leading-relaxed text-[#E0E7FF]">
        {question}
      </p>
    </div>
  );
};

const LevelSelector = ({
  value,
  onChange,
  disabled,
}: {
  value: ExperienceLevel;
  onChange: (value: ExperienceLevel) => void;
  disabled: boolean;
}) => (
  <div className="mb-6">
    <label className="mb-2 block text-sm font-medium text-[#94A3B8]">
      Experience Level
    </label>
    <Select
      value={value}
      onValueChange={(val) => onChange(val as ExperienceLevel)}
      disabled={disabled}
    >
      <SelectTrigger className="border-[#1E2A4A] bg-[#1E293B] text-white">
        <SelectValue>
          <div className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            {experienceLevels[value].label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-[#1E2A4A] bg-[#1E293B]">
        {(Object.keys(experienceLevels) as ExperienceLevel[]).map((level) => (
          <SelectItem
            key={level}
            value={level}
            className="text-white focus:bg-[#4F46E5]"
          >
            <div className="flex items-center">
              {React.createElement(experienceLevels[level].icon, {
                className: "mr-2 h-4 w-4",
              })}
              {experienceLevels[level].label};
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const FeedbackDialog = ({
  feedback,
  open,
  onOpenChange,
}: {
  feedback: Evaluation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="h-[90vh] max-w-[95vw] overflow-y-auto border-[#1E2A4A] bg-[#0D1425]">
      <DialogHeader className="sticky z-10 bg-[#0D1425] pb-4">
        <DialogTitle className="flex items-center text-2xl text-white">
          <GraduationCap className="mr-2 h-6 w-6 text-[#4F46E5]" />
          Interview Feedback
        </DialogTitle>
      </DialogHeader>

      {feedback && (
        <div className="space-y-8">
          {/* Score Section */}
          <div className="flex flex-wrap gap-6">
            <div className="min-w-[280px] flex-1 rounded-lg bg-[#1E293B] p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium text-[#94A3B8]">
                  Score
                </span>
                <span className="text-3xl font-bold text-white">
                  {feedback.score}/10
                </span>
              </div>
              <Progress
                value={feedback.score * 10}
                className="h-3 bg-[#1E2A4A]"
              />
            </div>

            <div className="min-w-[280px] flex-1 rounded-lg bg-[#1E293B] p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">
                Interview Result
              </h4>
              {feedback.score >= 7 ? (
                <div className="flex items-center text-lg text-green-500">
                  <CheckCircle2 className="mr-3 h-6 w-6" />
                  Strong Performance
                </div>
              ) : (
                <div className="flex items-center text-lg text-red-500">
                  <XCircle className="mr-3 h-6 w-6" />
                  Needs Improvement
                </div>
              )}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="rounded-lg bg-[#1E293B] p-6">
            <h4 className="mb-4 text-xl font-semibold text-white">
              Detailed Feedback
            </h4>
            <p className="text-lg leading-relaxed text-[#94A3B8]">
              {feedback.feedback}
            </p>
          </div>

          {/* Strengths and Improvements */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 rounded-lg bg-[#1E293B] p-6">
              <h4 className="mb-4 flex items-center text-xl font-semibold text-white">
                <CheckCircle2 className="mr-3 h-6 w-6 text-green-500" />
                Strengths
              </h4>
              <ul className="space-y-4">
                {feedback.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start text-lg text-[#94A3B8]"
                  >
                    <ArrowRight className="mr-3 mt-1 h-5 w-5 text-[#4F46E5]" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 rounded-lg bg-[#1E293B] p-6">
              <h4 className="mb-4 flex items-center text-xl font-semibold text-white">
                <Timer className="mr-3 h-6 w-6 text-yellow-500" />
                Areas to Improve
              </h4>
              <ul className="space-y-4">
                {feedback.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start text-lg text-[#94A3B8]"
                  >
                    <ArrowRight className="mr-3 mt-1 h-5 w-5 text-[#4F46E5]" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <DialogFooter className="sticky bottom-0 bg-[#0D1425] pt-4">
        <Button
          className="w-full bg-[#4F46E5] py-6 text-lg text-white hover:bg-[#4338CA]"
          onClick={() => onOpenChange(false)}
        >
          Continue Practice
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function TutorPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | "">("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("junior");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function getNewQuestion() {
    if (!selectedTopic) return;

    setLoadingQuestion(true);
    try {
      const res = await axios.post<Question>(getApiUrl("/tutor/questions"), {
        topic: selectedTopic,
        level: experienceLevel,
      });

      setQuestion(res.data.question);
      setAnswer("");
      setFeedback(null);
      toast.success("New interview question loaded!");
    } catch (error) {
      console.error("Failed to fetch question", error);
      toast.error("Failed to load question. Please try again.");
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function handleSubmit() {
    if (!answer.trim() || !question || !selectedTopic) return;

    setLoading(true);
    try {
      const res = await axios.post<Evaluation>(getApiUrl("/tutor/evaluate"), {
        question,
        answer,
        topic: selectedTopic,
        level: experienceLevel,
      });

      setFeedback(res.data);
      setDialogOpen(true);
      toast.success("Answer evaluated! Check your feedback.");
    } catch (error) {
      console.error("Failed to evaluate answer", error);
      toast.error("Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f3c] to-[#0A0F1C]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <Card className="border-[#1E2A4A] bg-[#0D1425] shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-[#1E2A4A] px-4 py-2">
                <Brain className="mr-2 h-5 w-5 text-[#4F46E5]" />
                <span className="font-medium text-[#E0E7FF]">
                  Interview Prep AI
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white">
                Practice Technical Interviews
              </h1>
              <p className="mx-auto max-w-md text-[#94A3B8]">
                Get real interview questions and expert feedback
              </p>
            </div>

            <LevelSelector
              value={experienceLevel}
              onChange={setExperienceLevel}
              disabled={loadingQuestion}
            />

            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  className={`h-auto px-4 py-3 ${
                    selectedTopic === topic
                      ? "border-[#4F46E5] bg-[#1E293B] text-white"
                      : "border-[#1E2A4A] bg-transparent text-[#94A3B8] hover:border-[#4F46E5] hover:bg-[#1E293B] hover:text-white"
                  } transition-all duration-200`}
                  onClick={() => {
                    setSelectedTopic(topic);
                    getNewQuestion();
                  }}
                  disabled={loadingQuestion}
                >
                  {topic}
                </Button>
              ))}
            </div>

            {selectedTopic &&
              (loadingQuestion ? (
                <QuestionSkeleton />
              ) : (
                question && (
                  <div className="space-y-6">
                    <QuestionCard
                      question={question}
                      topic={selectedTopic}
                      level={experienceLevel}
                      onNewQuestion={getNewQuestion}
                      loadingQuestion={loadingQuestion}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#94A3B8]">
                        Your Answer
                      </label>
                      <Textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={`Explain your approach, discuss trade-offs, and provide implementation details appropriate for a ${experienceLevel} level position...`}
                        className="min-h-[200px] border-[#1E2A4A] bg-[#1E293B] text-white placeholder:text-[#64748B] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                        disabled={loading}
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !answer.trim()}
                      className="w-full bg-[#4F46E5] py-6 text-lg text-white hover:bg-[#4338CA]"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Evaluating Response...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit for Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                )
              ))}
          </CardContent>
        </Card>
      </div>

      <FeedbackDialog
        feedback={feedback}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
