import { ProblemDetail } from "@/components/problem-page/ProblemDetail";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProblemSubmitBar } from "../../../../components/problem-page/ProblemSubmitBar";
import { getProblem } from "../../../../controllers/problem";


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
      <main className="flex-1 py-2 md:py-5 h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
        >

          <ResizablePanel defaultSize={50}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md  px-6 h-ful">
              <div className="prose prose-stone dark:prose-invert h-full ">
                <ProblemDetail problem={problem} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-700 w-2 cursor-col-resize" />


          <ResizablePanel defaultSize={50}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 h-full">
              <ProblemSubmitBar problem={problem} />
            </div>
          </ResizablePanel>


        </ResizablePanelGroup>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";


