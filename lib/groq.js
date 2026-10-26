import Groq from "groq-sdk";

let groq;

// Created on first use so a missing key surfaces as a handled API error, not a crash on import
function getClient() {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set");
  groq ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a brutally honest but helpful senior tech recruiter who roasts resumes.
Be witty and savage in the roast, but every criticism must be specific to THIS resume and actionable.
Respond ONLY with a JSON object in exactly this shape:
{
  "score": number from 0 to 100 (how ready this resume is for top tech jobs),
  "headline": "one short savage line summing up the resume",
  "roast": "a funny 3-5 sentence roast of the resume",
  "strengths": ["3 specific things that are good"],
  "weaknesses": ["3-5 specific problems"],
  "suggestions": ["3-5 concrete fixes, each starting with a verb"]
}`;

export async function roastResume(resumeText) {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Here is the resume:\n\n${resumeText.slice(0, 15000)}` },
    ],
  });

  const result = JSON.parse(completion.choices[0].message.content);
  const list = (value) => (Array.isArray(value) ? value.map(String) : []);

  return {
    score: Math.max(0, Math.min(100, Math.round(Number(result.score) || 0))),
    headline: String(result.headline || "No headline. Much like this resume."),
    roast: String(result.roast || ""),
    strengths: list(result.strengths),
    weaknesses: list(result.weaknesses),
    suggestions: list(result.suggestions),
  };
}
