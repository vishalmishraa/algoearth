"use client";
import { useEffect, useState } from "react";
import { parseClock } from "../lib/time";
import { Card, CardContent } from "./ui/card";
import { Trophy } from "lucide-react";

export const ContestPoints = ({ points }: { points: number }) => {
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Points Earned</h2>
        </div>
        <div className="mt-4 text-center">
          <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{points}</span>
          <span className="ml-2 text-2xl font-semibold text-indigo-500 dark:text-indigo-300">points</span>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Great job in the coding contest!
        </p>
      </CardContent>
    </Card>
  );
};
