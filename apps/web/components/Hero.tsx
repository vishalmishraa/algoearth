import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Code, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24 relative">
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/hero.webp"
          layout="fill"
          objectFit="cover"
          alt="AlgoEarth Coding"
          className="opacity-10 blur-sm"
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Algo Earth</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Embark on an exciting coding journey with AlgoEarth. Our platform offers a seamless, engaging, and competitive environment to test and showcase your programming skills. Whether you're a beginner or an advanced coder, we're here to elevate your coding experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contests" prefetch={false}>
                <Button className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 flex items-center justify-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Contests
                </Button>
              </Link>
              <Link href="/problems" prefetch={false}>
                <Button variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 flex items-center justify-center">
                  <Code className="mr-2 h-5 w-5" />
                  View Problems
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25"></div>
            <Image
              src="/hero.webp"
              width={700}
              height={500}
              alt="AlgoEarth Coding"
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
