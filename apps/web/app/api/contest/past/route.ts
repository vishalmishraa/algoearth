
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const contest = await db.contest.findMany({
        where: {
            hidden: false,
            endTime: {
                lt: new Date(),
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });

    return NextResponse.json(contest);

};


