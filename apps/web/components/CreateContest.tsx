"use client"
import { CreaatedContest } from "@/components/CreaatedContest"
import { LockSelectProblems } from "@/components/LockSelectProblems"
import { SelectProblemsTable } from "@/components/SelectProblemsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateContest } from "@/hooks/usecreateContest"
import Link from "next/link"


export function CreateContest() {
    const {
        newContest,
        numberOfProblem,
        handleInputChange,
        setNumberOfProblems,
        handleSubmit
    } = useCreateContest();
    
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
                                <SelectProblemsTable contestId={newContest.id} hight={500} setNumberOfProblems={setNumberOfProblems} />
                            </div>
                        ) : <LockSelectProblems />
                    }
                </div>
            </div>
        </div>
    )
};
