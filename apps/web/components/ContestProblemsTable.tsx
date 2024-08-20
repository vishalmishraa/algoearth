import Link from "next/link";
import { Button } from "./ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

interface ProblemRowProps {
  id: string;
  title: string;
  difficulty: string;
  submissionCount: number;
  contestId: string;
  points: number;
}

export const ContestProblemsTable = ({
  contest,
}: {
  contest: {
    title: string;
    description: string;
    id: string;
    problems: {
      problem: {
        id: string;
        title: string;
        difficulty: string;
        solved: number;
      };
    }[];
    contestSubmissions: {
      userId: string;
      problemId: string;
      contestId: string;
      points: number;
    }[];
  };
}) => {
  return (
    <div className="flex flex-col">
      <main className="flex-1 py-4 md:py-8">
        <div className="container mx-auto px-4">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">{contest.title}</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Difficulty</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Solved</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contest.problems.map(({ problem }) => (
                    <ProblemRow
                      points={
                        contest.contestSubmissions.find(
                          (submission) => submission.problemId === problem.id,
                        )?.points || 0
                      }
                      contestId={contest.id}
                      key={problem.id}
                      id={problem.id}
                      title={problem.title}
                      difficulty={problem.difficulty}
                      submissionCount={problem.solved}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

function ProblemRow({
  id,
  title,
  difficulty,
  submissionCount,
  contestId,
  points,
}: ProblemRowProps) {
  const difficultyColor = {
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Hard: "text-red-600 dark:text-red-400",
  }[difficulty] || "text-gray-600 dark:text-gray-400";

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      <TableCell className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</div>
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
        <div className={`text-sm font-medium ${difficultyColor}`}>
          {difficulty}
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-500 dark:text-gray-400">{submissionCount}</div>
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {points ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link href={`/contest/${contestId}/problem/${id}`}>
          <Button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            Solve
            <ChevronRightIcon className="ml-2 -mr-1 h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
