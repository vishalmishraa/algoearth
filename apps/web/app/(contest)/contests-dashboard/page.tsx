"use client"
import Loading, { SmallPageLoading } from '@/components/Loading'
import SignInFirst from '@/components/SignInFirst'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import UserContestTable from '@/components/UserContestTable'
import { IContest, IProblems } from "@repo/common/types"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ContestDashboardPage = () => {
    const { data, status } = useSession();
    const [contests, setContests] = useState<IContest[]>([]);
    const [problems, setProblems] = useState<IProblems[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const fetchData = async () => {
                setLoading(true);
                const contest: IContest[] = (await axios.get(`api/contest`)).data;
                setContests(contest);

                const problems: IProblems[] = await (await axios.get(`api/problems`)).data

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
                            <UserContestTable contests={contests} setContests={setContests} />
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
