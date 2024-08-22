"use client"
import { SelectProblemsTable } from "@/components/SelectProblemsTable"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
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
import useConttestTable from "@/hooks/useUserContestTable"
import { TrashIcon } from "lucide-react"
import Link from 'next/link'
import React from 'react'

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

    const {
        convertToIST,
        editingContestId,
        deletingContestId,
        editingContest,
        formattedDateTime,
        handleCancel,
        handleCancelDelete,
        handleCheckInputChange,
        handleConfirmDelete,
        handleDelete,
        handleEdit,
        handleInputChange,
        handleSubmit,
        setNumberOfProblems
    } = useConttestTable({ contests, setContests });


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
                                            <SelectProblemsTable contestId={contest.id} hight={350} setNumberOfProblems={setNumberOfProblems} />
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