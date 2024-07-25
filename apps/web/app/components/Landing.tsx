import { Contests } from "./Contests";
import { Hero } from "./Hero";
import { PopularProblems } from "./PopularProblems";

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Contests />
        <PopularProblems />
      </main>
    </div>
  );
}
