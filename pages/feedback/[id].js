import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import ScoreCircle from "@/components/ScoreCircle";
import FeedbackCard from "@/components/FeedbackCard";

export async function getServerSideProps({ req, res, params }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: "/", permanent: false } };

  const roast = await prisma.roast.findUnique({ where: { id: params.id } });
  if (!roast || roast.userEmail !== session.user.email) return { notFound: true };

  return { props: { roast: { ...roast, createdAt: roast.createdAt.toISOString() } } };
}

export default function FeedbackPage({ roast }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <ScoreCircle score={roast.score} />
        <div className="text-center sm:text-left">
          <p className="text-sm text-zinc-500">{roast.fileName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">{roast.headline}</h1>
          <p className="text-zinc-300 mt-4 leading-relaxed">🔥 {roast.roast}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <FeedbackCard title="Strengths" icon="💪" items={roast.strengths} tone="green" />
        <FeedbackCard title="Weaknesses" icon="💀" items={roast.weaknesses} tone="red" />
        <FeedbackCard title="How to fix it" icon="🛠️" items={roast.suggestions} tone="blue" />
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/upload" className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-5 py-2.5 rounded-xl">
          Roast another
        </Link>
        <Link href="/" className="border border-zinc-700 hover:border-zinc-500 px-5 py-2.5 rounded-xl">
          All roasts
        </Link>
      </div>
    </div>
  );
}
