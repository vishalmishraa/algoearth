import db from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const problems = await db.problem.findMany({
        where: {
            contests: {
                some: {}
            }
        },
        include: {
            contests: true
        }
    });

    return NextResponse.json({ problems });
}