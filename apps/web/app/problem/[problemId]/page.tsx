import { ProblemStatement } from "../../components/ProblemStatement";
import { ProblemSubmitBar } from "../../components/ProblemSubmitBar";
import { getProblem } from "../../controllers/problem";

export default async function ProblemPage({
  params: { problemId },
}: {
  params: {
    problemId: string;
  };
}) {
  //@ts-ignore
  const problem = await getProblem(problemId);
  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row space-x-4 pt-4 pl-10 h-[5%] ">
        {
          problem.tags.length > 0 && (
            problem.tags.map((tag) => (
              <div key={tag.id} className=" rounded-3xl bg-[#ffffff1a]  px-3 py-1">{(tag.name).toLowerCase()}</div>
            ))
          )
        }
      </div>
      <main className="flex-1 py-2 md:py-5 grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <div className="prose prose-stone dark:prose-invert">
            <ProblemStatement description={problem.description} title={problem.title} tags={problem.tags} />
          </div>
        </div>
        <ProblemSubmitBar problem={problem} />
      </main>
    </div>
  );
}
export const dynamic = "force-dynamic";
