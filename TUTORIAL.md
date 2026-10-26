# Setup Tutorial

## Step 1: Supabase database
1. Create a free project at https://supabase.com.
2. Click **Connect** at the top of the project dashboard.
3. Copy the **Transaction pooler** string into `DATABASE_URL` and add `?pgbouncer=true` to the end.
4. Copy the **Session pooler** string into `DIRECT_URL`.
5. Replace `[YOUR-PASSWORD]` in both with your database password.

## Step 2: Groq API key
1. Sign in at https://console.groq.com.
2. Go to **API Keys → Create API Key** and put it in `GROQ_API_KEY`.

## Step 3: GitHub sign-in
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Homepage URL: your Vercel URL (or `http://localhost:3000`).
3. Authorization callback URL: `<homepage URL>/api/auth/callback/github`.
4. Copy the Client ID into `GITHUB_ID`, generate a client secret and put it in `GITHUB_SECRET`.

## Step 4: Deploy to Vercel
1. Import the repo at https://vercel.com/new.
2. Add every variable from `.env.example` under **Environment Variables**. Set `NEXTAUTH_URL` to your Vercel URL.
3. Deploy. If you only learn your Vercel URL after the first deploy, update `NEXTAUTH_URL` and the GitHub OAuth app, then redeploy.
