import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          MedSupply
        </div>
        
        <h1 className="text-3xl font-bold text-center">
          Welcome to MedSupply
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
          Your secure platform for managing clinical operations and patient care.
        </p>

        <Link 
          href="/login" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-8 sm:px-10"
        >
          Sign In / Sign Up
        </Link>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a
          className="hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        <a
          className="hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>
        <a
          className="hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Support
        </a>
      </footer>
    </div>
  );
}
