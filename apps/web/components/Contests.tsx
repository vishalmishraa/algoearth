"use client"
import { useEffect, useState } from "react";
import { ContestCard } from "./ContestCard";
import { Icontest } from "./SelectProblemsTable";
import axios from "axios";
import { toast } from "react-toastify";

export function Contests() {

  const [upcomingContests, setUpcomingContests] = useState<Icontest[]>([]);
  const [pastContests, setPastContests] = useState<Icontest[]>([]);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const upConsRes = await axios.get('/api/contest/upcoming');
        if (upConsRes.status !== 200) {
          throw new Error(upConsRes.data.message);
        }
        setUpcomingContests(upConsRes.data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "An error occurred while fetching contests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const pastConsRes = await axios.get('/api/contest/past');
        if (pastConsRes.status !== 200) {
          throw new Error(pastConsRes.data.message);
        }
        setPastContests(pastConsRes.data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "An error occurred while fetching contests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="min-h-screen">
      <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Upcoming Contests</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Check out the upcoming programming contests on Codeforces.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Previous Contests</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Check out the previous programming contests on Codeforces.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
