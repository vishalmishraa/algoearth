import { NextRequest, NextResponse } from "next/server";
import { SubmissionInput } from "@repo/common/zod";
import { getProblem } from "../../../lib/problems";
import axios from "axios";
import { LANGUAGE_MAPPING } from "@repo/common/language";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { isRequestAllowed } from "@/lib/redis";


const JUDGE0_URI = process.env.JUDGE0_URI;
const CLOUD_FLARE_TURNSTILE_SECRET_KEY = process.env.CLOUD_FLARE_TURNSTILE_SECRET_KEY as string;
const CLOUD_FLARE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";


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
    };

    //Check if user is allowed to submit
    const allowed = await isRequestAllowed(session.user.id, 60);// 1 minute window for 2 requests
    if (!allowed) {
        return NextResponse.json(
            {
                message: "Rate limit exceeded",
                status: 429
            }
        );
    };


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

    if (process.env.NODE_ENV === "production") {
        let formData = new FormData();
        formData.append('secret', CLOUD_FLARE_TURNSTILE_SECRET_KEY);
        formData.append('response', submissionInput.data.token);

        const turnstileResponse = await axios.post(CLOUD_FLARE_URL, formData);
        if (!turnstileResponse.data.success) {
            return NextResponse.json(
                {
                    message: "Invalid token",
                    status: 400
                }
            );
        };
    }

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

    if (submission?.status === "AC") {
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