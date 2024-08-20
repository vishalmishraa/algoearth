


import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const contests = await db.contest.findMany({
        where: {
            hidden: false,
            endTime: {
                gt: new Date(),
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });

    return NextResponse.json(contests);

};


