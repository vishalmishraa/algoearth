
import { IContest } from "@repo/common/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import moment from "moment"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { formatDateTime, convertToIST} from "@/lib/time"

export function CreaatedContest({ contest, numberOfProblem }: { contest: IContest, numberOfProblem: number }) {
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
