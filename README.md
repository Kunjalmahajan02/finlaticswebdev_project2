# 🔥 AI Resume Roaster

Upload your resume as a PDF and get a brutally honest AI review: a score out of 100, a savage roast, strengths, weaknesses and concrete fixes. Every roast is saved so you can track how your resume improves.

## Tech stack

- **Next.js 14** (Pages Router) with API routes
- **Groq** (`openai/gpt-oss-120b` by default, override with `GROQ_MODEL`) with JSON output mode
- **pdf-parse** to extract text from the uploaded PDF
- **NextAuth.js** with GitHub sign-in
- **Prisma + Supabase** (PostgreSQL) to store roasts
- **Tailwind CSS**

## How it works

1. User signs in with GitHub.
2. `/upload`: the PDF is sent to `/api/upload`, which extracts its text with pdf-parse.
3. The text goes to `/api/roast`, which asks Groq for a JSON review and saves it with Prisma.
4. The user is sent to `/feedback/[id]` to see their score and feedback. Past roasts are listed on the home page.

## Project structure

```
components/   Header, UploadDropzone, ScoreCircle, FeedbackCard
lib/          auth.js (NextAuth config), db.js (Prisma client), groq.js (AI prompt), pdfParser.js
pages/        index, upload, feedback/[id]
pages/api/    auth/[...nextauth], upload, roast
prisma/       schema.prisma (Roast model)
```

## Run locally

1. Copy `.env.example` to `.env` and fill in every value.
2. Install and create the database table:
   ```
   npm install
   npx prisma db push
   ```
3. Start the dev server:
   ```
   npm run dev
   ```

## Environment variables

| Name | Where to get it |
| --- | --- |
| `DATABASE_URL` | Supabase → Connect → Transaction pooler (port 6543), add `?pgbouncer=true` |
| `DIRECT_URL` | Supabase → Connect → Session pooler (port 5432) |
| `GROQ_API_KEY` | https://console.groq.com/keys |
| `GROQ_MODEL` | Optional. Any current model from https://console.groq.com/docs/models |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your Vercel URL in production |
| `NEXTAUTH_SECRET` | Any long random string |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub → Settings → Developer settings → OAuth Apps |

## Deploy to Vercel

Import the repo in Vercel and add all the environment variables above. The build command runs `prisma db push`, so the database table is created automatically on first deploy. Set the GitHub OAuth app's callback URL to `https://<your-app>.vercel.app/api/auth/callback/github`.
