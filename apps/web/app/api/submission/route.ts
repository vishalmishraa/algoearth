import { NextRequest, NextResponse } from "next/server";
import { SubmissionInput } from "@repo/common/zod";
import { getProblem } from "../../lib/problems";
import axios from "axios";
import { LANGUAGE_MAPPING } from "@repo/common/language";
import db from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";


const JUDGE0_URI = process.env.JUDGE0_URI;


export async function POST(req: NextRequest) {
    //Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            {
                message: "You must be logged in to submit a problem",
                status: 401
            }
        );
    }


    //get and check the submission input
    const submissionInput = SubmissionInput.safeParse(await req.json());
    if (!submissionInput.success) {
        return NextResponse.json(
            {
                message: "Invalid submission",
                status: 400
            }
        );
    };

    //get the problem
    const dbProblem = await db.problem.findUnique({
        where: {
            id: submissionInput.data.problemId,
        },
    });

    if (!dbProblem) {
        return NextResponse.json(
            {
                message: "Problem not found",
                status: 404
            }
        );
    };

    //get the problem from file-path
    const problem = await getProblem(
        dbProblem.slug,
        submissionInput.data.languageId
    );

    //replace the boilerplate code with user code
    problem.fullBoilerplateCode = problem?.fullBoilerplateCode?.replace(
        "##USER_CODE_HERE##",
        submissionInput.data.code
    );

    //make the submission to judge0
    const response = await axios.post(
        `${JUDGE0_URI}/submissions/batch?base64_encoded=false`,
        {
            submissions: problem.inputs.map((input, index) => ({
                language_id: LANGUAGE_MAPPING[submissionInput.data.languageId]?.judge0,
                source_code: problem.fullBoilerplateCode.replace(
                    "##INPUT_FILE_INDEX##",
                    index.toString()
                ),
                expected_output: problem.outputs[index],
            })),
        }
    );
    

    //create the submission in the database
    const submission = await db.submission.create({
        data: {
            userId: session.user.id,
            problemId: submissionInput.data.problemId,
            code: submissionInput.data.code,
            activeContestId: submissionInput.data.activeContestId,
            testcases: {
                connect: response.data
            },
        },
        include: {
            testcases: true,
        },
    });

    return NextResponse.json(
        {
            message: "Submission made",
            id: submission.id,
            status: 200,
        }
    );

};

export async function GET(req: NextRequest) {
    //Check if user is logged in    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            {
                message: "You must be logged in to view submissions",
                status: 401,
            }
        );
    };

    //Get the submission id
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const submissionId = searchParams.get("id");

    if (!submissionId) {
        return NextResponse.json(
            {
                message: "Invalid submission id",
                status: 400,
            }
        );
    }

    //find submission in the database
    var submission = await db.submission.findUnique({
        where: {
            id: submissionId,
        },
        include: {
            testcases: true,
        },
    });

    if(submission?.status === "AC"){
        const updatedProblem = await db.problem.update({
            where: {
                id: submission.problemId,
            },
            data: {
                solved: {
                    increment: 1
                }
            },
        });

        if (!updatedProblem) {
            return NextResponse.json(
                {
                    message: "Problem not found or update failed",
                    status: 404
                }
            );
        }
    }
    
    if (!submission) {
        return NextResponse.json(
            {
                message: "Submission not found",
                status: 404,
            }
        );
    };

    return NextResponse.json(
        {
            submission,
            status: 200
        }
    );


};