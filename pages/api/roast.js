import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { roastResume } from "@/lib/groq";
import prisma from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Please sign in first" });

  const { text, fileName } = req.body || {};
  if (typeof text !== "string" || text.length < 100) {
    return res.status(400).json({ error: "Resume text is missing" });
  }

  try {
    const result = await roastResume(text);
    const roast = await prisma.roast.create({
      data: { ...result, fileName: String(fileName || "resume.pdf"), userEmail: session.user.email },
    });
    res.status(200).json({ id: roast.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The AI choked on your resume. Try again." });
  }
}
