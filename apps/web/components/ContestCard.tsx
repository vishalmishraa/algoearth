import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import Link from "next/link";
import { parseFutureDate, parseOldDate } from "../lib/time";
import { PrimaryButton } from "./LinkButton";
import { Clock, Calendar, Trophy } from "lucide-react";
import { Button } from "./ui/button";

interface ContestCardParams {
  title: string;
  id: string;
  endTime: Date;
  startTime: Date;
}

export function ContestCard({
  title,
  id,
  startTime,
  endTime,
}: ContestCardParams) {
  const duration = `${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60))} hours`;
  const isActive = startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-indigo-100 dark:border-indigo-900">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 text-indigo-900 dark:text-indigo-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="text-sm font-semibold">
            {startTime.getTime() < Date.now() && endTime.getTime() < Date.now() && (
              <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 px-3 py-1 rounded-full">Ended</span>
            )}
            {isActive && (
              <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full">Active</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {startTime.getTime() < Date.now() ? "Started" : "Starts in"}
              </p>
              <p className="font-medium text-indigo-700 dark:text-indigo-300">
                {startTime.getTime() < Date.now()
                  ? parseOldDate(new Date(startTime))
                  : parseFutureDate(new Date(startTime))}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-3 h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-medium text-indigo-700 dark:text-indigo-300">{duration}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-indigo-50 dark:bg-indigo-900 rounded-b-lg flex justify-center ">
        <Link href={`/contest/${id}`} className="w-full max-w-xs mt-4">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-300 py-3 rounded-lg font-semibold">
            <Trophy className="mr-2 h-5 w-5" />
            <span>{isActive ? "Participate Now" : "View Contest"}</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
