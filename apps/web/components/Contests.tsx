"use client"
import { useEffect, useState } from "react";
import { ContestCard } from "./ContestCard";
import { Icontest } from "./SelectProblemsTable";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export function Contests() {
  const [upcomingContests, setUpcomingContests] = useState<Icontest[]>([]);
  const [pastContests, setPastContests] = useState<Icontest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          axios.get('/api/contest/upcoming'),
          axios.get('/api/contest/past')
        ]);

        if (upcomingRes.status !== 200 || pastRes.status !== 200) {
          throw new Error("Failed to fetch contests");
        }

        setUpcomingContests(upcomingRes.data);
        setPastContests(pastRes.data)
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "An error occurred while fetching contests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ShowContest upcomingContests={upcomingContests} pastContests={pastContests} />
    </div>
  );
}

function ShowContest({ upcomingContests, pastContests }: { upcomingContests: Icontest[], pastContests: Icontest[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">Upcoming Contests</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Challenge yourself in these exciting upcoming coding competitions!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingContests && upcomingContests.map((contest) => (
              <ContestCard
                key={contest.id}
                title={contest.title}
                id={contest.id}
                startTime={new Date(contest.startTime)}
                endTime={new Date(contest.endTime)}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 bg-indigo-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">Past Contests</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore our archive of previous coding battles and learn from the best!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastContests && pastContests.map((contest) => (
              <ContestCard
                key={contest.id}
                title={contest.title}
                id={contest.id}
                startTime={new Date(contest.startTime)}
                endTime={new Date(contest.endTime)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}