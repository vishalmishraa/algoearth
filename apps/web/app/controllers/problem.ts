import db from "@/app/db";

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

export const getProblem = async (ProblemId: string, contestId: string) => {
    if (contestId) {
        try {
            const contest = await db.contest.findFirst({
                where: {
                    id: contestId,
                    hidden: false,
                },
            });
            if (!contest) {
                return null;
            }

            const problem = await db.problem.findFirst({
                where: {
                    id: ProblemId,
                    contests: {
                        some: {
                            contestId: contestId,
                        },
                    },
                },
                include: {
                    defaultCode: true,
                },
            }); 

            return problem;
        } catch (error) {
            console.error("Error fetching problem:", error);
            throw error;
        }

    }

    const problem = await db.problem.findFirst({
        where: {
            id: ProblemId,
        },
        include: {
            defaultCode: true,
        },
    });
    return problem;

};