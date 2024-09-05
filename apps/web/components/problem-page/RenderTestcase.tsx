import { submissions as SubmissionsType } from "@prisma/client";
import { testStatus } from "./TestStatus";
export interface IProblem {
    id: string;
    title: string;
    description: string;
    slug: string;
    defaultCode: {
        languageId: number;
        code: string;
    }[];
};

export function RenderTestcase({ testcases }: { testcases: SubmissionsType[] }) {
    return (
        <div className="grid grid-cols-6 gap-4">
            {testcases.map((testcase, index) => (
                <div key={index} className="border rounded-md">
                    <div className="px-2 pt-2 flex justify-center">
                        <div className="">Test #{index + 1}</div>
                    </div>
                    <div className="p-2 flex justify-center">
                        {testStatus(testcase.status_id)}
                    </div>
                </div>
            ))}
        </div>
    );
};