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


const patterns: { [key: string]: RegExp } = {
    fileOperations: /#include\s*<fstream>/, // File operations
    systemOperations: /#include\s*<cstdlib>/, // System operations
    systemCalls: /system\s*\(/, // System calls
    filesystemOperations: /std::filesystem::/, // Filesystem operations
    fileOutput: /std::ofstream/, // File output
    fileInput: /std::ifstream/, // File input
    fileInputOutput: /std::fstream/, // File input/output
    removeFiles: /std::remove/, // Remove files
    renameFiles: /std::rename/, // Rename files
    networkingBoost: /#include\s*<boost\/asio.hpp>/, // Networking
    networkingBoostTcp: /#include\s*<boost\/asio\/ip\/tcp.hpp>/, // Networking
    multithreading: /std::thread/, // Multithreading
    asynchronousOperations: /std::async/, // Asynchronous operations
    sharedPointers: /std::shared_ptr/, // Shared pointers
    uniquePointers: /std::unique_ptr/, // Unique pointers

    osOperations: /import\s*os/, // OS operations
    subprocessOperations: /import\s*subprocess/, // Subprocess operations
    fileOperationsPython: /open\s*\(/, // File operations
    systemCallsPython: /os\.system\s*\(/, // System calls
    removeFilesPython: /os\.remove\s*\(/, // Remove files
    renameFilesPython: /os\.rename\s*\(/, // Rename files
    networkingSocket: /import\s*socket/, // Networking
    httpServer: /import\s*http\.server/, // HTTP server
    flaskServer: /import\s*flask/, // Flask server
    multithreadingPython: /import\s*threading/, // Multithreading
    asynchronousOperationsPython: /import\s*asyncio/, // Asynchronous operations

    standardIOOperations: /#include\s*<stdio.h>/, // Standard I/O operations
    standardLibrary: /#include\s*<stdlib.h>/, // Standard library
    systemCallsC: /system\s*\(/, // System calls
    fileOperationsC: /fopen\s*\(/, // File operations
    fileCloseC: /fclose\s*\(/, // File operations
    removeFilesC: /remove\s*\(/, // Remove files
    renameFilesC: /rename\s*\(/, // Rename files
    multithreadingC: /pthread_create/, // Multithreading
    multithreadingJoinC: /pthread_join/, // Multithreading

    fileOperationsJava: /import\s*java\.io\./, // File operations
    nioFileOperations: /import\s*java\.nio\.file\./, // NIO file operations
    networkingJava: /import\s*java\.net\./, // Networking
    systemCallsJava: /Runtime\.getRuntime\(\)\.exec/, // System calls
    processCreation: /new\s*ProcessBuilder/, // Process creation
    concurrencyUtilities: /import\s*java\.util\.concurrent\./, // Concurrency utilities
    multithreadingJava: /import\s*java\.lang\.Thread/, // Multithreading

    fileSystemOperationsNode: /require\s*\('fs'\)/, // File system operations
    childProcessOperations: /require\s*\('child_process'\)/, // Child process operations
    fileWriteNode: /fs\.writeFile/, // File write
    fileReadNode: /fs\.readFile/, // File read
    removeFilesNode: /fs\.unlink/, // Remove files
    renameFilesNode: /fs\.rename/, // Rename files
    executeSystemCommands: /child_process\.exec/, // Execute system commands
    spawnNewProcess: /child_process\.spawn/, // Spawn new process
    httpServerNode: /require\s*\('http'\)/, // HTTP server
    httpsServerNode: /require\s*\('https'\)/, // HTTPS server
    networkingNode: /require\s*\('net'\)/, // Networking
    tlsSslNode: /require\s*\('tls'\)/, // TLS/SSL
};

function isMaliciousCode(code: string) {
    const maliciousPatterns = Object.values(patterns);
    return maliciousPatterns.some((pattern) => pattern.test(code));
}

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

    if (isMaliciousCode(submissionInput.data.code)) {
        console.log(`maliccious code detected : ${submissionInput.data.code} `)
        return NextResponse.json(
            {
                message: "Malicious code detected",
                status: 400
            }
        );
    }

    //replace the boilerplate code with user code
    problem.fullBoilerplateCode = problem?.fullBoilerplateCode?.replace(
        "##USER_CODE_HERE##",
        submissionInput.data.code
    );

    //make the submission to judge0
    const response = await axios.post(
        `${JUDGE0_URI}/submissions/batch`,
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