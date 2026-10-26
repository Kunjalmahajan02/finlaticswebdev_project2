import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import "@/styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>AI Resume Roaster</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Upload your resume and get a brutally honest AI roast with a score and fixes." />
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-12">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
