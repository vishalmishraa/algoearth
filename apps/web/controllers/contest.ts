import { getServerSession } from "next-auth";
import db from "@repo/db/client";
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

        console.log(" up contest", contest);

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

        console.log("existing contest", contest);   
        return contest; 
    } catch (error) {
        console.error("Error fetching existing contest:", error);
        throw error;
    }
};

export const getContest = async(contestId: string)=>{
    const session = await getServerSession(authOptions);
    const contest = await db.contest.findMany({
        where: {
            id: contestId,
            hidden: false,
        },
        include:{
            problems : {
                include:{
                    problem:true
                }
            },
            contestSubmissions:{
                where:{
                    userId: session?.user?.id
                }
            },
        },
    });

    return contest;
}