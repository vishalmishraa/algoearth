import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { getProblems } from "../controllers/problem";
import { Button } from "./ui/button";
import Link from "next/link";
import { Code, Star, Users } from "lucide-react";

export async function PopularProblems() {
  const problems = await getProblems();

  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 md:py-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">Popular Problems</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Challenge yourself with the most popular programming problems on AlgoEarth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <ProblemCard problem={problem} key={problem.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ problem }: { problem: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{problem.title}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          {problem.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="font-semibold">{problem.difficulty}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-green-500 mr-2" />
            <span>{problem.solved} submissions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-slate-900 text-white hover:bg-slate-950">
          <Link href={`/problem/${problem.id}`}>
            View Problem
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
