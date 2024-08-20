import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to Algo Earth
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              At AlgoEarth, we provide a seamless, engaging, and competitive environment to test and showcase your programming skills. Whether you&apos;re a beginner or an advanced coder, our platform is tailored to offer you the best experience.Ready to embark on your coding journey?
            </p>
            <div className="flex gap-4 pt-16">
              <Link
                href="/contests-dashboard"
                prefetch={false}
              >
                <Button className="px-20 py-6 rounded-full border-2 border-gray-100" variant={'secondary'}>Contests Dashboard</Button>
              </Link>
              <Link
                href="/contests"
                prefetch={false}
              >
                <Button className="px-20 py-6 rounded-full border-gray-300" variant={'outline'}>{"View Contest"}</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/hero.webp"
              width="700"
              height="500"
              alt="algoearth"
              className="rounded-lg"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
