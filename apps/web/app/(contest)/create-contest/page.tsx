"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Icontest, IProblems  } from "../contests-dashboard/page"
import { SelectProblemsTable } from "@/components/SelectProblemsTable"
import moment from "moment"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function createContest() {
    const [newContest, setNewContest] = useState<Icontest>()
    const [numberOfProblem, setNumberOfProblems] = useState<number>(0)
    const [problems, setProblems] = useState<IProblems[]>([]);
    const [loading, setLoading] = useState(true);
    const [createContest, setCreateContest] = useState<Icontest>()
    const [selectedProblems, setSelectedProblems] = useState<{ problemid: string, contestId: string }[]>([]);


    useEffect(() => {
        try {
            const fetchData = async () => {
                setLoading(true);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        console.log({ name, value, type });
        if ((name === 'startTime' || name === 'endTime') && value !== '') {
            const formattedValue = new Date(value).toISOString();
            setCreateContest((prevState: Icontest | undefined) => ({
                ...prevState,
                [name]: formattedValue
            } as Icontest));
        } else {
            setCreateContest((prevState: Icontest | undefined) => ({
                ...prevState,
                [name]: value
            } as Icontest));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //at save  , save the edited contest in db
        try {
            setLoading(true)
            //only passs , id , title , description , startTime , endTime , hidden
            const parsedContest = createContest ? {
                title: createContest.title,
                description: createContest.description,
                startTime: createContest.startTime,
                endTime: createContest.endTime,
            } : null;


            const response = await fetch('api/contest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedContest),
            }
            )

            const data = await response.json();

            console.log(data);

            if (data.status !== 200) {
                return (
                    toast.error("Error in Creating contest")
                )
            }

            //update that specific contest in the contests array
            setNewContest(data?.data)
            setLoading(false)

            return (
                toast.success("Contest Created successfully")
            )
        } catch (error) {
            console.error(error);
            return toast.error('something went wrong')
        }

    }

    newContest ? console.log(`${newContest} ---> ${typeof newContest?.endTime}`) : console.log(' ');

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
                <Link
                    href={`/contests-dashboard`}
                >
                    <Button className='border-green-500 absolute right-0 mr-6 top-0 mt-24 border-2 bg-slate-700 text-white hover:bg-slate-500'>
                        Contest Dashboard
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
                    !newContest ?
                        (
                            <div className="bg-background rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-4">Create a New Contest</h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <Label htmlFor="contest-name">Contest Name</Label>
                                        <Input
                                            id="contest-name"
                                            type="text"
                                            name="title"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contest-description">Description</Label>
                                        <Textarea
                                            id="contest-description"
                                            name="description"
                                            placeholder="Contest Description"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="start-date">Start Date</Label>
                                            <Input
                                                type="datetime-local"
                                                onBlur={handleInputChange}
                                                name='startTime'
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="end-date">End Date</Label>
                                            <Input
                                                type="datetime-local"
                                                onBlur={handleInputChange}
                                                name='endTime'
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit">
                                        Create Contest
                                    </Button>
                                </form>
                            </div>

                        ) : (
                            //@ts-ignore
                            <CreaatedContest contest={newContest} numberOfProblem={numberOfProblem} />
                        )
                }
                <div className="bg-background rounded-lg shadow-md p-6 flex flex-col">
                    {
                        newContest ? (
                            <div>
                                <SelectProblemsTable setSelectedProblems={setSelectedProblems} selectedProblems={selectedProblems}  contestId={newContest.id} hight={500} setNumberOfProblems={setNumberOfProblems} />
                            </div>
                        ) : <LockSelectProblems />
                    }
                </div>
            </div>
        </div>
    )
};


function LockSelectProblems() {
    return (
        <div className="grid place-items-center  ">
            <Card className="bg-card p-4 rounded-md shadow-sm w-[500px] h-[500px]">

                <div className="font-semibold text-2xl ml-2">
                    Select Problems
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <svg
                        className="w-10 h-10 text-muted-foreground mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <p className="text-center text-muted-foreground">
                        Please create a contest first to select problems.
                    </p>
                </div>


            </Card>
        </div>
    )
}

function CreaatedContest({ contest, numberOfProblem }: { contest: Icontest, numberOfProblem: number }) {
    const formattedDateTime = (date: Date) => {
        return moment(date).utcOffset("+05:30").format('DD / MM / YYYY - hh:mm A');
    }

    const convertToIST = (date: Date) => {
        if (date) {
            date.setHours(date.getHours() + 5);
            date.setMinutes(date.getMinutes() + 30);
            return formattedDateTime(date);
        }
    }

    const router = useRouter();

    const handlePublish = async () => {
        try {
            const res = await fetch('/api/contest/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: contest.id,
                    hidden: false
                }),
            });

            const data = await res.json();

            if (data?.status !== 200) {
                toast.error(data?.message);
                return;
            }

            toast.success(data?.message);
            router.push(`/contest/${contest.id}`);

        } catch (error) {
            console.log(error)
            toast.error('something went wrong')
        }

    }

    const handleCreateNewContest = () => {
        window.location.reload();
    }

    return (
        <Card className="mx-10 mb-20  mt-10">
            <CardHeader>
                <CardTitle className="text-2xl">Your Contest</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-1">
                    <p className="text-muted-foreground">Title</p>
                    <p>
                        {contest.title}
                    </p>
                </div>
                <div className="grid gap-1">
                    <p className="text-muted-foreground">Description</p>
                    <p>
                        {contest.description}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1">
                        <p className="text-muted-foreground">Start Time</p>
                        <p>{convertToIST(new Date(contest.startTime))}</p>
                    </div>
                    <div className="grid gap-1">
                        <p className="text-muted-foreground">End Time</p>
                        <p>{convertToIST(new Date(contest.endTime))}</p>
                    </div>
                </div>
                <div className="grid gap-1">
                    <p className="text-muted-foreground">View</p>
                    <p>{contest.hidden ? 'Hidden' : 'Public'}</p>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col gap-4 w-full">
                    <Button variant={'default'} className="w-full" disabled={numberOfProblem < 1} onClick={handlePublish}>Publish Contest</Button>
                    {
                        numberOfProblem < 1 && <p className=" text-red-500">please select atleast one problem</p>
                    }
                    <Button variant="secondary" onClick={handleCreateNewContest} className="w-full">
                        Create new contest
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
