import db from "@repo/db/client";



export const getProblems = async () => {
    const problems = await db.problem.findMany({
        where: {
            hidden: false,
        },
        include: {
            defaultCode: true,
        },
        take: 6,
    });

    return problems;
};