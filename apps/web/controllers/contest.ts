import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "../lib/auth";



export const getUpCommingContest = async () => {
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


        return contest;
    } catch (error) {
        console.error("Error fetching upcoming contest:", error);
        throw error;
    }
};

export const getExistingContest = async () => {
    try {
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

        return contest;
    } catch (error) {
        console.error("Error fetching existing contest:", error);
        throw error;
    }
};

export const getContest = async (contestId: string) => {
    const session = await getServerSession(authOptions);
    const contest = await db.contest.findFirst({
        where: {
            id: contestId,
            hidden: false,
        },
        include: {
            problems: {
                select: {
                    problem:true
                }
            },
            contestSubmissions: {
                where: {
                    userId: session?.user?.id
                }
            },
        },
    });

    return contest;
}

export const getContestByUserId = async (userId: string) => {
    const contests = await db.contest.findMany({
        where: {
            authorId: userId
        }
    });

    return contests;
}