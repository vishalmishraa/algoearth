import db from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { CreatecontestZod } from "../../../../../packages/common/zod/contest";
import { authOptions } from "../../../lib/auth";

export async function GET(req: NextRequest) {
    //Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            {
                message: "You must be logged in to get your contests",
                status: 401
            }
        );
    };

    //get contest by user id 
    const contest = await db.contest.findMany({
        where: {
            authorId: session.user.id
        }
    });

    return NextResponse.json(contest);

};


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
        const body = await req.json();

        const data = CreatecontestZod.parse(body);

        const newContest = await db.contest.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                author: {
                    connect: {
                        id: session.user.id
                    }
                },
            }
        }); 
        
        return NextResponse.json({
            message: "Contest updated successfully",
            status: 200,
            data: newContest
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "An error occurred while updating the contest",
            status: 500
        });
    }
}


