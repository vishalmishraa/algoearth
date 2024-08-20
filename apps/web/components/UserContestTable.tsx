"use client"
import { SelectProblemsTable } from "@/components/SelectProblemsTable"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { TrashIcon } from "lucide-react"
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
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


export default function UserContestTable({ contests, setContests }: { contests: Icontest[], setContests: React.Dispatch<React.SetStateAction<Icontest[]>> }) {

    const [editingContestId, setEditingContestId] = useState<string | null>(null);
    const [editingContest, setEditingContest] = useState<Icontest | null>(null);
    const [numberOfProblem, setNumberOfProblems] = useState<number>(0)
    const [deletingContestId, setDeletingContestId] = useState<string | null>(null)
    const [selectedProblems, setSelectedProblems] = useState<{ problemid: string, contestId: string }[]>([]);


    const handleEdit = (id: string) => {
        console.log(id);
        setEditingContestId(id);
        const contest = contests.find((contest) => contest.id === id);
        if (contest) {
            setEditingContest(contest);
        }
    }

    const formattedDateTime = (date: Date) => {
        return moment(date).utcOffset("+05:30").format('DD / MM / YYYY - hh:mm A');
    }


    const handleCheckInputChange = (checked: boolean) => {
        console.log("clicked");
        setEditingContest((editingContest) => {
            if (editingContest) {
                console.log(editingContest)
                console.log(checked)
                return {
                    ...editingContest,
                    hidden: !checked,
                };
            }
            return editingContest;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        console.log({ name, value, type, checked });
        if (editingContest) {
            console.log(editingContest);
            if ((name === 'startTime' || name === 'endTime') && value !== '') {
                const formattedValue = new Date(value).toISOString();
                setEditingContest({ ...editingContest, [name]: formattedValue });
            } else {
                console.log(editingContest);
                setEditingContest({ ...editingContest, [name]: value });
                console.log(editingContest);
            }
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //at save  , save the edited contest in db
        try {
            setEditingContestId(null);
            console.log(editingContest);
            //only passs , id , title , description , startTime , endTime , hidden
            const parsedContest = editingContest ? {
                id: editingContest.id,
                title: editingContest.title,
                description: editingContest.description,
                startTime: editingContest.startTime,
                endTime: editingContest.endTime,
                hidden: editingContest.hidden
            } : null;


            const response = await fetch('api/contest/update', {
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
                    toast.error("Error updating contest")
                )
            }

            //update that specific contest in the contests array
            const updatedContests = contests.map((contest) => {
                console.log(contest.id);
                console.log(data.data.id);
                if (contest.id === data.data.id) {
                    return data.data;
                }
                return contest;
            });
            console.log(updatedContests);
            setContests(updatedContests);

            return (
                toast.success("Contest updated successfully")
            )
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    }


    const handleCancel = () => {
        setEditingContestId(null);
    }

    const convertToIST = (date: Date) => {
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);
        return date;
    }

    const handleDelete = (id: string) => {
        console.log('clicked', id)
        setDeletingContestId(id)
        console.log(deletingContestId)
    }

    const handleConfirmDelete = async () => {
        try {
            const deleteContest = await axios.post(`/api/contest/delete`, { id: deletingContestId });

            if (deleteContest.data.status !== 200) {
                toast.error('Something went wrong while deleting the contest.');
                return;
            }

            setContests((prevContests) => prevContests.filter((contest) => contest.id !== deletingContestId));
            toast.success(deleteContest.data.message);
        } catch (error) {
            toast.error('Error deleting contest');
        } finally {
            setDeletingContestId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeletingContestId(null)
    }

    return (
        <div className="bg-background rounded-lg border p-6 w-full ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold ">Your Contests</h2>
                <Link
                    href={`/create-contest`}
                >
                    <Button className='border-green-500 border-2 bg-slate-700 text-white hover:bg-slate-500'>
                        Create New Contest
                    </Button>
                </Link>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contest Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Select Problems</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contests.map((contest) => (
                        <TableRow key={contest.id} >
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <Input
                                        placeholder='Title'
                                        defaultValue={contest.title}
                                        onBlur={handleInputChange}
                                        required
                                        name='title'
                                    />
                                ) : (
                                    contest.title
                                )}
                            </TableCell>
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <Input
                                        defaultValue={contest.description}
                                        onBlur={handleInputChange}
                                        required
                                        type='text'
                                        name='description'
                                    />
                                ) : (
                                    <div>
                                        <div className='hidden md:block'>{contest.description}</div>
                                        <div className='md:hidden'>{contest.description.split(' ').slice(0, 3).join(' ')}</div>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <Input
                                        type="datetime-local"
                                        onBlur={handleInputChange}
                                        name='startTime'
                                        defaultValue={convertToIST(new Date(contest.startTime)).toISOString().slice(0, 16)}
                                    />
                                ) : (
                                    <div>
                                        <div className='hidden md:block'>{formattedDateTime(contest.endTime)}</div>
                                        <div className='md:hidden'>{formattedDateTime(contest.startTime).slice(-8)}</div>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <Input
                                        type="datetime-local"
                                        defaultValue={convertToIST(new Date(contest.endTime)).toISOString().slice(0, 16)}
                                        onBlur={handleInputChange}
                                        name='endTime'
                                    />
                                ) : (

                                    <div>
                                        <div className='hidden md:block'>{formattedDateTime(contest.endTime)}</div>
                                        <div className='md:hidden'>{formattedDateTime(contest.endTime).slice(-8)}</div>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <Checkbox
                                        id={`contest-${contest.id}-visibility`}
                                        checked={!editingContest?.hidden}
                                        onCheckedChange={handleCheckInputChange}
                                        name='hidden'
                                    />
                                ) : contest.hidden ? (
                                    "Hidden"
                                ) : (
                                    "Public"
                                )}
                            </TableCell>
                            {/* edit contest */}
                            <TableCell>
                                {editingContestId === contest.id ? (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleSubmit} disabled={!(editingContest !== contest)}>
                                            Save
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(contest.id)}>
                                        Edit
                                    </Button>
                                )}
                            </TableCell>
                            {/* select problems  */}
                            <TableCell>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline">Select Problems</Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <div className="mx-auto w-full ">
                                            <DrawerClose asChild className='absolute right-0 mr-10'>
                                                <Button variant="destructive">Cancel</Button>
                                            </DrawerClose>
                                            <SelectProblemsTable contestId={contest.id} hight={350} setNumberOfProblems={setNumberOfProblems} selectedProblems={selectedProblems} setSelectedProblems={setSelectedProblems} />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </TableCell>
                            <TableCell>
                                {deletingContestId && deletingContestId === contest.id ? (
                                    <AlertDialog open={true}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Contest</AlertDialogTitle>
                                                <AlertDialogDescription>Are you sure you want to delete this contest?</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="gap-2 ">
                                                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500">Delete</AlertDialogAction>
                                                <AlertDialogCancel onClick={handleCancelDelete} className="bg-secondary" >Cancel</AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(contest.id)}
                                        className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    )
};