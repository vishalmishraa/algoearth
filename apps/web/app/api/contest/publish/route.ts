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

        const data = await req.json();

        const contest = db.contest.findFirst({
            where: {
                id: data.id,
                authorId: session.user.id
            }
        });

        if (!contest) {
            return NextResponse.json(
                {
                    message: "You are not allowed to edit this contest",
                    status: 400,
                }
            );
        }

        const updatedContest = await db.contest.update({
            where: {
                id: data.id
            },
            data: {
                hidden: data.hidden,
            }
        });

        return NextResponse.json({
            message: "Contest Published successfully",
            status: 200,
            data: updatedContest
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "An error occurred while updating the contest",
            status: 500
        });
    }
}