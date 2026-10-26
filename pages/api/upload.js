import { getServerSession } from "next-auth/next";
import formidable from "formidable";
import fs from "fs/promises";
import { authOptions } from "@/lib/auth";
import { parsePDF } from "@/lib/pdfParser";

// formidable reads the multipart body itself
export const config = { api: { bodyParser: false } };

const MAX_SIZE = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Please sign in first" });

  try {
    const form = formidable({ maxFileSize: MAX_SIZE });
    const [, files] = await form.parse(req);
    const file = files.resume?.[0];

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (file.mimetype !== "application/pdf") return res.status(400).json({ error: "Only PDF files are allowed" });

    const text = await parsePDF(await fs.readFile(file.filepath));
    if (text.length < 100) {
      return res.status(422).json({ error: "Couldn't read text from this PDF. Is it a scanned image?" });
    }

    res.status(200).json({ text, fileName: file.originalFilename || "resume.pdf" });
  } catch (err) {
    console.error(err);
    const tooBig = err.code === 1009 || err.httpCode === 413;
    res.status(tooBig ? 413 : 500).json({ error: tooBig ? "File is larger than 4 MB" : "Failed to read the PDF" });
  }
}
