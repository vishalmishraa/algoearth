import { Contests } from "./Contests";
import { Hero } from "./Hero";
import { Problems } from "./Problems";

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Contests/>
        <Problems/>
      </main>
    </div>
  );
}
