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
}   