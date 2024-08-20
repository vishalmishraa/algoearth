"use client"
import Loading, { SmallPageLoading } from '@/components/Loading'
import SignInFirst from '@/components/SignInFirst'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import UserContestTable from '@/components/UserContestTable'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export interface Icontest {
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



const ContestDashboardPage = () => {
    const { data, status } = useSession();
    const [contests, setContests] = useState<Icontest[]>([]);
    const [problems, setProblems] = useState<IProblems[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const fetchData = async () => {
                setLoading(true);
                const contest: Icontest[] = (await axios.get(`api/contest`)).data;
                setContests(contest);

                const ProblemsResponse = await fetch(`api/problems`);
                const problems: IProblems[] = await ProblemsResponse.json();
                setProblems(problems);

                setLoading(false);
            };

            fetchData();
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    }, []);

    if (status === 'loading') {
        return (
            <div>
                <Loading />
            </div>
        )
    }

    if (!data) {
        return (
            <div>
                <SignInFirst />
            </div>
        )
    }

    return (
        <div>
            {loading ? (
                <div>
                    <SmallPageLoading />
                </div>
            ) : (
                <div>
                    {contests.length !== 0 ? (
                        <div>
                            <UserContestTable contests={contests} setContests={setContests}/>
                        </div>
                    ) : (
                        <Card className="w-full max-w-md mx-auto mt-8">
                            <CardHeader>
                                <CardTitle>No Contests Found</CardTitle>
                                <CardDescription>You haven't created any contests yet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">Get started by creating your first contest!</p>
                            </CardContent>
                            <CardFooter>
                                <Link href="/create-contest">
                                    <Button className="w-full">Create New Contest</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}


export default ContestDashboardPage;
