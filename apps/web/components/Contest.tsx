import { getContest } from "@/controllers/contest";
import { ContestClock } from "./ContestClock";
import { ContestPoints } from "./ContestPoints";
import { ContestProblemsTable } from "./ContestProblemsTable";

export async function Contest({ id }: { id: string }) {
  const contest = await getContest(id);

  
  
  if (!contest) {
    return <div>Contest not found</div>;
  }

  return (
    <div className="grid grid-flow-row-dense  grid-cols md:grid-cols-12 gap-4 grid-cols-1 min-h-screen px-2 md:px-12">
      <div className="col-span-9 mt-2">
        <ContestProblemsTable contest={contest} />
      </div>
      <div className="col-span-3 ml-20 pb-6 md:ml-0">
        <div className="col-span-3 pt-2 md:pt-24">
          <ContestClock endTime={contest.endTime} startTime={contest.startTime}/>
        </div>
        <div className="pt-10">
          <ContestPoints
            points={contest.contestSubmissions.reduce(
              (acc, curr) => acc + curr.points,
              0,
            )}
          />
        </div>
      </div>
    </div>
  );
}
