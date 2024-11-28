import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <h1 className="text-3xl font-bold text-center">
          Welcome to Your Application
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
          Your secure platform for managing clinical operations and patient care.
        </p>

        <div className="w-full max-w-sm p-6 bg-white dark:bg-black/[.06] rounded-lg border border-black/[.08] dark:border-white/[.145]">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
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
