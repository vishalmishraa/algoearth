import db from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";


export async function GET(req: NextRequest) {
    //Check if user is logged in
    try {
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
        //get contest by user id 
        const problems = await db.problem.findMany({
            include: {
                contests: {
                    select: {
                        contestId: true
                    }
                }
            }
        });


        return NextResponse.json(problems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        return NextResponse.json(
            {
                message: "An error occurred while fetching problems",
                status: 500
            }
        );
    }

};

export const dynamic = 'force-dynamic';
