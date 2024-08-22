export interface IContest {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    hidden: boolean;
    endTime: Date;
    createdAt: Date;
    updatedAt: Date;
    leaderboard: boolean;
    authorId: string;
}

export interface IContestProblem {
    contestId: string;
    problemId: string;
}

export interface IProblems {
    id: string;
    title: string;
    description: string;
    hidden: boolean;
    slug: string;
    solved: number;
    difficulty: string;
    contests: IContestProblem[]
}

// Add other shared interfaces here