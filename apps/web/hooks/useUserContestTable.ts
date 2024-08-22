import { IContest } from "@repo/common/types"
import axios from "axios"
import moment from 'moment'
import React, { useState } from 'react'
import { toast } from "react-toastify"

export default function useConttestTable({ contests, setContests }: { contests: IContest[], setContests: React.Dispatch<React.SetStateAction<IContest[]>> }) {

    const [editingContestId, setEditingContestId] = useState<string | null>(null);
    const [editingContest, setEditingContest] = useState<IContest | null>(null);
    const [numberOfProblem, setNumberOfProblems] = useState<number>(0)
    const [deletingContestId, setDeletingContestId] = useState<string | null>(null)


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

    return {
        handleCancelDelete,
        handleConfirmDelete,
        handleDelete,
        convertToIST,
        handleCancel,
        handleSubmit,
        handleInputChange,
        handleCheckInputChange,
        formattedDateTime,
        handleEdit,
        editingContestId,
        setNumberOfProblems,
        setEditingContest,
        editingContest,
        deletingContestId
    }
}