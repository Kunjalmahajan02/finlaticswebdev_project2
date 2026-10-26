// Import the inner module directly: pdf-parse's index.js runs a debug test on load
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function parsePDF(buffer) {
  const data = await pdf(buffer);
  return data.text.replace(/\n{3,}/g, "\n\n").trim();
}
