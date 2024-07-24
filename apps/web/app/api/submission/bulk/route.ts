import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

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
    }


    //Get the problem id
    const url = new URL(req.url);

    const searchParams = new URLSearchParams(url.search);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
        return NextResponse.json(
            {
                message: "Invalid problem id",
                status: 400,
            }
        );
    }

    const submissions = await db.submission.findMany({
        where: {
            problemId: problemId,
            userId: session.user.id,
        },
        take: 10,
        include: {
            testcases: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(
        {
            submissions,
            status: 200,
        }
    );
}
