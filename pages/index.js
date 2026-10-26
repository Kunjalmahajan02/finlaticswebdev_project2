import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return { props: { signedIn: false, roasts: [] } };

  const roasts = await prisma.roast.findMany({
    where: { userEmail: session.user.email },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, score: true, headline: true, createdAt: true },
    take: 20,
  });

  return {
    props: {
      signedIn: true,
      roasts: roasts.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    },
  };
}

const STEPS = [
  ["📄", "Upload", "Drop in your resume as a PDF."],
  ["🤖", "Get roasted", "AI reads it like a picky recruiter would."],
  ["🛠️", "Fix it", "Get a score, strengths, weaknesses and fixes."],
];

export default function Home({ signedIn, roasts }) {
  return (
    <>
      <section className="text-center py-12">
        <p className="text-orange-500 font-medium mb-3">Powered by Groq · Llama 3.3</p>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
          Your resume, <span className="text-orange-500">roasted</span> 🔥
        </h1>
        <p className="text-zinc-400 text-lg mt-5 max-w-xl mx-auto">
          Upload your PDF and get a brutally honest score, a savage roast, and concrete fixes in seconds.
        </p>
        <div className="mt-8">
          {signedIn ? (
            <Link
              href="/upload"
              className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-3 rounded-xl"
            >
              Roast my resume
            </Link>
          ) : (
            <button
              onClick={() => signIn("github", { callbackUrl: "/upload" })}
              className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-3 rounded-xl"
            >
              Sign in to get roasted
            </button>
          )}
        </div>
      </section>

      {!signedIn && (
        <section className="grid sm:grid-cols-3 gap-5 mt-8">
          {STEPS.map(([icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-zinc-400 text-sm mt-1">{text}</p>
            </div>
          ))}
        </section>
      )}

      {signedIn && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your past roasts</h2>
          {roasts.length === 0 ? (
            <p className="text-zinc-400">No roasts yet. Brave enough to try?</p>
          ) : (
            <ul className="space-y-3">
              {roasts.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/feedback/${r.id}`}
                    className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600"
                  >
                    <span className="text-2xl font-bold w-12 text-center">{r.score}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.headline}</p>
                      <p className="text-sm text-zinc-500 truncate">
                        {r.fileName} · {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
