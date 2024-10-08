"use client";
import { useContestTime } from "@/hooks/useContestTime";
import { Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const ContestClock = ({ startTime, endTime }: { startTime: Date; endTime: Date }) => {

  const {
    hours,
    isStarted,
    minutes,
    seconds,
    timeLeft
  } = useContestTime({ startTime, endTime });

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-lg sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {isStarted ? "Contest Ends In" : "Contest Starts In"}
          </h2>
        </div>
        {timeLeft > 0 ? (
          <div className="mt-2 sm:mt-4 flex justify-center space-x-2 sm:space-x-4 text-2xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            <div className="flex flex-col items-center">
              <span>{hours.toString().padStart(2, '0')}</span>
              <span className="text-xs sm:text-sm font-normal text-indigo-500 dark:text-indigo-300">Hours</span>
            </div>
            <span className="text-indigo-400">:</span>
            <div className="flex flex-col items-center">
              <span>{minutes.toString().padStart(2, '0')}</span>
              <span className="text-xs sm:text-sm font-normal text-indigo-500 dark:text-indigo-300">Minutes</span>
            </div>
            <span className="text-indigo-400">:</span>
            <div className="flex flex-col items-center">
              <span>{seconds.toString().padStart(2, '0')}</span>
              <span className="text-xs sm:text-sm font-normal text-indigo-500 dark:text-indigo-300">Seconds</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 sm:mt-4 text-center text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400">
            {isStarted ? "Contest Ended" : "Contest Starting Soon"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
