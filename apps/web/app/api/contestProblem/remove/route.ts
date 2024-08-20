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
        // const body: { contestId: string, problemId: string } = await req.json();

        const body: { contestId_problemId: { contestId: string, problemId: string }[] } = await req.json();

        const deletedContestProblems = await db.contestProblem.deleteMany({
            where: {
                OR: body.contestId_problemId.map(cp => ({
                    contestId: cp.contestId,
                    problemId: cp.problemId
                }))
            }
        });

        return NextResponse.json({
            message: "Problem removed successfully",
            status: 200,
            data: deletedContestProblems

        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "An error occurred while updating the contest",
            status: 500
        });
    }
}