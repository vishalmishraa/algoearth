
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {

        const contest = await db.contest.findMany({
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


        return NextResponse.json(contest, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error("Error fetching problems:", error);
        return NextResponse.json(
            {
                message: "An error occurred while fetching problems",
                status: 500,
                timestamp: new Date().toISOString()
            }
        );
    }

};

export const dynamic = 'force-dynamic';



