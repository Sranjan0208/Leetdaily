import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Topic,
  Question,
  Evaluation,
  ExperienceLevel,
} from "@/types/tutor-problem";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Template for question format
const questionTemplate = `{
  "question": "The actual interview question text goes here",
  "expectedKeyPoints": ["Key concept 1", "Key concept 2"],
  "difficulty": "junior | mid | senior",
  "category": "system-design | problem-solving | implementation | architecture",
  "commonAt": ["Google", "Amazon", "Microsoft"]
}`;

function extractJSONFromText(text: string): string {
  // Try to find JSON-like content within the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // If no JSON-like content is found, try to convert the text into a valid JSON structure
  try {
    const cleanText = text
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/\n\*/g, "\n-") // Convert markdown lists to plain text
      .trim();

    // Create a simplified JSON structure from the text
    return JSON.stringify({
      question: cleanText,
      expectedKeyPoints: [
        "Understanding of system design",
        "Problem-solving ability",
      ],
      difficulty: "senior",
      category: "system-design",
      commonAt: ["General Tech Companies"],
    });
  } catch (error) {
    console.error(error);
    throw new Error("Could not extract or create valid JSON from response");
  }
}

export async function generateQuestion(
  topic: Topic,
  level: ExperienceLevel,
): Promise<Question> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate a technical interview question about ${topic} for a ${level} developer position.
The question should focus on system design, problem-solving, or real-world scenarios which are asked on the given level.
It should test both theoretical knowledge and practical implementation.
Include expected key points and common companies where this question is asked.

Your response MUST be in this exact JSON format with no other text:
${questionTemplate}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("API returned an empty response.");
    }

    // First try to parse the response directly
    try {
      return JSON.parse(responseText) as Question;
    } catch (initialParseError) {
      console.error(initialParseError);
      // If direct parsing fails, try to extract or create JSON from the text
      const extractedJSON = extractJSONFromText(responseText);
      try {
        const parsedResponse = JSON.parse(extractedJSON) as Question;

        // Validate the required fields
        if (
          !parsedResponse.question ||
          typeof parsedResponse.question !== "string"
        ) {
          throw new Error("Invalid question format");
        }

        return parsedResponse;
      } catch (extractedParseError) {
        console.error("Failed to parse extracted JSON:", extractedParseError);

        // Return a fallback response
        return {
          question: `Please describe how you would implement a ${topic} system, considering scalability, performance, and best practices.`,
          expectedKeyPoints: [`Scalability`, `Performance`, `Best Practices`],
          difficulty: level,
          category: "system-design",
          commonAt: ["General Tech Interviews"],
        };
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to generate question for ${topic}`);
  }
}

function extractEvaluationFromText(text: string, topic: string): Evaluation {
  try {
    // First try to find JSON-like content within the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedJSON = JSON.parse(jsonMatch[0]);
      if (isValidEvaluation(parsedJSON)) {
        return parsedJSON;
      }
    }

    // If no valid JSON found, try to extract structured information
    const scoreMatch = text.match(/score:?\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 5;

    // Extract feedback (look for keywords like "feedback:", "evaluation:", etc.)
    const feedbackMatch = text.match(
      /feedback:?\s*([^]*?)(?=strengths:|improvements:|$)/i,
    );
    const feedback = feedbackMatch
      ? feedbackMatch[1].trim()
      : `Your answer to the ${topic} question showed partial understanding.`;

    // Extract strengths (look for bullet points or numbered lists after "strengths:")
    const strengthsMatch = text.match(/strengths:?[^]*?(?=improvements:|$)/i);
    const strengths = strengthsMatch
      ? extractListItems(strengthsMatch[0])
      : ["Attempted to address the main points"];

    // Extract improvements (look for bullet points or numbered lists after "improvements:")
    const improvementsMatch = text.match(/improvements:?[^]*/i);
    const improvements = improvementsMatch
      ? extractListItems(improvementsMatch[0])
      : ["Add more specific examples", "Consider edge cases"];

    return {
      score: Math.max(1, Math.min(10, score)),
      feedback,
      strengths,
      improvements,
    };
  } catch (error) {
    console.error(error);
    return createFallbackEvaluation(topic);
  }
}

function extractListItems(text: string): string[] {
  // Remove the header (e.g., "strengths:" or "improvements:")
  const content = text.replace(/^[^:]*:\s*/, "");

  // Try to find bullet points or numbered items
  const items = content.match(/(?:^|\n)(?:[-•*]|\d+\.)\s*([^\n]+)/g);

  if (items) {
    return items
      .map((item) => item.replace(/^(?:[-•*]|\d+\.)\s*/, "").trim())
      .filter((item) => item.length > 0);
  }

  // If no bullet points found, split by newlines and clean up
  return content
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function isValidEvaluation(obj: any): obj is Evaluation {
  return (
    typeof obj === "object" &&
    typeof obj.score === "number" &&
    typeof obj.feedback === "string" &&
    Array.isArray(obj.strengths) &&
    Array.isArray(obj.improvements) &&
    obj.strengths.every((s: any) => typeof s === "string") &&
    obj.improvements.every((i: any) => typeof i === "string")
  );
}

function createFallbackEvaluation(topic: string): Evaluation {
  return {
    score: 5,
    feedback: `Your answer to the ${topic} question showed understanding but needs more detail.`,
    strengths: ["Attempted to address the main points"],
    improvements: ["Add more specific examples", "Consider edge cases"],
  };
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  topic: Topic,
  level: ExperienceLevel,
): Promise<Evaluation> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const evaluationPrompt = `Act as a technical interviewer at a top tech company evaluating a candidate's response.
Topic: ${topic}
Question: ${question}
Candidate's Level: ${level}
Candidate's Answer: ${answer}

Evaluate the response and provide a structured assessment with a score (1-10), detailed feedback, strengths, and areas for improvement.
Your response MUST be in this exact JSON format with no other text:
{
  "score": 7,
  "feedback": "Detailed constructive feedback explaining the score...",
  "strengths": [
    "Strong understanding of core concepts",
    "Good consideration of trade-offs",
    "Clear communication"
  ],
  "improvements": [
    "Consider discussing scalability more",
    "Add specific examples",
    "Address security concerns"
  ]
}`;

  try {
    const result = await model.generateContent(evaluationPrompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("API returned an empty response.");
    }

    // First try to parse the response directly
    try {
      const cleanedResponse = responseText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();

      const parsedResponse = JSON.parse(cleanedResponse) as Evaluation;

      if (isValidEvaluation(parsedResponse)) {
        // Ensure score is within valid range
        parsedResponse.score = Math.max(1, Math.min(10, parsedResponse.score));
        return parsedResponse;
      }

      throw new Error("Invalid evaluation format");
    } catch (parseError) {
      console.error("Initial JSON Parse Error:", parseError);
      console.error("Invalid JSON Response:", responseText);

      // If direct parsing fails, try to extract structured information
      return extractEvaluationFromText(responseText, topic);
    }
  } catch (error) {
    console.error("API Error:", error);
    return createFallbackEvaluation(topic);
  }
}
