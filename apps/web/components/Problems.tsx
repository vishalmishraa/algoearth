import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { getAllProblems } from "../controllers/problem";
import { Button } from "./ui/button";
import Link from "next/link";
import { Code, Star, Users } from "lucide-react";

export async function Problems() {
  const problems = await getAllProblems();

  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 md:py-16 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-0 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">Popular Problems</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Challenge yourself with the most popular programming problems on AlgoEarth.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span>{problem.difficulty}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-500 mr-2" />
                      <span>{problem.solved} submissions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button asChild className="bg-slate-900 text-white hover:bg-slate-950">
                      <Link href={`/problem/${problem.id}`}>
                        View Problem
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}