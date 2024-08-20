import db from "@/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function POST(req: Request) {
    try {
        // Check if user is logged in
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "You must be logged in to delete a contest",
                    status: 401
                }
            );
        }

        // Read and parse the request body
        const body = await req.json();
        const { id } = body;


        if (!id) {
            return NextResponse.json(
                {
                    message: "Contest ID is required",
                    status: 400
                }
            );
        }

        // Check if the contest exists and belongs to the user
        const contest = await db.contest.findUnique({
            where: {
                id: id,
                authorId: session.user.id
            }
        });

        if (!contest) {
            return NextResponse.json(
                {
                    message: "Contest not found or you don't have permission to delete it",
                    status: 404
                }
            );
        }

        // Delete the contest
        await db.contest.delete({
            where: {
                id: id
            }
        });

        return NextResponse.json({
            message: "Contest deleted successfully",
            status: 200
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "An error occurred while deleting the contest",
            status: 500
        });
    }
}
