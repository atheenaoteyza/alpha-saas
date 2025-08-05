import { Geist, Geist_Mono } from "next/font/google";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 justify-center items-center text-center">
        <h1 className="text-[32px] font-semibold">Welcome to StudyHub</h1>
        <SignedOut>
          <p className="max-w-md">
            Sign in to unlock your potential and begin training your focus.{" "}
          </p>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
              <SignInButton />
            </div>
          </div>
        </SignedOut>{" "}
        <SignedIn>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link href="/dashboard">
              <div className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
                Go to DashBoard
              </div>
            </Link>
          </div>
        </SignedIn>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/atheenaoteyza"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            aria-hidden="true"
          />
          Go to creator's profile →
        </a>
      </footer>
    </div>
  );
}
