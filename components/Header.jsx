import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg">
          🔥 Resume<span className="text-orange-500">Roaster</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {session && (
            <Link href="/upload" className="hidden sm:inline text-zinc-300 hover:text-white">
              New roast
            </Link>
          )}
          {status === "loading" ? null : session ? (
            <>
              {session.user.image && (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="px-3 py-1.5 rounded-lg bg-white text-black font-medium hover:bg-zinc-200"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
