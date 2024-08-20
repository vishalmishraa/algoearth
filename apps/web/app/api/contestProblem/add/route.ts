import db from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";


export async function POST(req: NextRequest) {
    try {

        //Check if user is logged in
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "You must be logged in to create a contest",
                    status: 401
                }
            );
        };


        /// Read and parse the request body
        const body: { contestId: string, problemId: string } = await req.json();

        const newContestProblem = await db.contestProblem.create({
            data: {
                contestId: body.contestId,
                problemId: body.problemId,
                index: 0
            }
        });


        return NextResponse.json({
            message: "Problem Added successfully",
            status: 200,
            data: newContestProblem

        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "An error occurred while updating the contest",
            status: 500
        });
    }
}