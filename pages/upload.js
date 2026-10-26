import { useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import UploadDropzone from "@/components/UploadDropzone";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return { redirect: { destination: "/api/auth/signin?callbackUrl=/upload", permanent: false } };
  }
  return { props: {} };
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState("idle"); // idle | reading | roasting
  const [error, setError] = useState("");

  const busy = step !== "idle";

  async function handleRoast() {
    setError("");
    if (!file) return setError("Pick a PDF first.");
    if (file.type !== "application/pdf") return setError("Only PDF files are allowed.");
    if (file.size > 4 * 1024 * 1024) return setError("File is larger than 4 MB.");

    try {
      setStep("reading");
      const body = new FormData();
      body.append("resume", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body });
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploaded.error);

      setStep("roasting");
      const roastRes = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploaded),
      });
      const roasted = await roastRes.json();
      if (!roastRes.ok) throw new Error(roasted.error);

      router.push(`/feedback/${roasted.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStep("idle");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Upload your resume</h1>
      <p className="text-zinc-400 mb-8">We only read the text. Your PDF isn&apos;t stored.</p>

      <UploadDropzone onFile={setFile} disabled={busy} />

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleRoast}
        disabled={busy || !file}
        className="mt-6 w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl"
      >
        {step === "reading" ? "Reading your PDF..." : step === "roasting" ? "Roasting... 🔥" : "Roast it"}
      </button>
    </div>
  );
}
