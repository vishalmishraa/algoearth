"use client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"


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

export function SelectProblemsTable({ contestId, hight, setNumberOfProblems, selectedProblems , setSelectedProblems }: {
    selectedProblems: {
        problemid: string;
        contestId: string;
    }[],
    setSelectedProblems: React.Dispatch<React.SetStateAction<{
        problemid: string;
        contestId: string;
    }[]>>, contestId: string,
    hight: number,
    setNumberOfProblems: React.Dispatch<React.SetStateAction<number>>
}) {
    const [loading, setLoading] = useState(false);
    const [problems, setProblems] = useState<IProblems[]>([]);

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
            toast.error('something went worng');
        }

    }, [])

    useEffect(() => {
        const initialSelected = problems
            .filter(problem => problem.contests.some(contest => contest.contestId === contestId))
            .map(problem => ({ problemid: problem.id, contestId }));
        setSelectedProblems(initialSelected);
    }, [problems, contestId]);

    const isSelected = (problemId: string): boolean => {
        return selectedProblems.some(problem => problem.problemid === problemId);
    };

    const handleSelect = async (problemId: string) => {
        try {
            setLoading(true);
            const res = await axios.post('/api/contestProblem/add', { contestId, problemId });

            if (res.data.status !== 200) {
                toast.error(res.data.message);
                setLoading(false);
                return;
            }
            setSelectedProblems(prev => [...prev, { problemid: problemId, contestId }]);
            setNumberOfProblems(selectedProblems.length + 1);
            setLoading(false);
            toast.success('Problem added');
        } catch (error) {
            console.error('Error adding problem to contest:', error);
            toast.error('Failed to add problem. Please try again.');
            setLoading(false);
        }
    };

    const handleRemove = async (problemId: string) => {
        try {
            setLoading(true);
            const res = await axios.post('/api/contestProblem/remove', { contestId_problemId: [{ contestId, problemId }] });

            if (res.data.status !== 200) {
                toast.error(res.data.message);
                setLoading(false);
                return;
            }

            setSelectedProblems(prev => prev.filter(problem => problem.problemid !== problemId));
            setNumberOfProblems(prev => prev - 1);

            setLoading(false);
            toast.success('Problem removed');
        } catch (error) {
            console.error('Error adding problem to contest:', error);
            toast.error('Failed to add problem. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-background rounded-lg shadow-md px-8 pb-8 pt-4 flex flex-col" style={{ height: `${hight}px` }}>
            <h2 className="text-2xl font-bold mb-4">Select Problems</h2>
            <div className="space-y-2 overflow-y-auto flex-grow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Problem Title</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Solved</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problems.map((problem) => (
                            <TableRow key={problem.id}>
                                <TableCell>{problem.title}</TableCell>
                                <TableCell>{problem.difficulty}</TableCell>
                                <TableCell>{problem.solved}</TableCell>
                                <TableCell>
                                    {isSelected(problem.id) ? (
                                        <Button
                                            variant={'destructive'}
                                            onClick={() => handleRemove(problem.id)}
                                            disabled={loading}
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={'outline'}
                                            onClick={() => handleSelect(problem.id)}
                                            disabled={loading}
                                        >
                                            Select
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isSelected(problem.id) && <div className='text-green-600'>Added</div>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
