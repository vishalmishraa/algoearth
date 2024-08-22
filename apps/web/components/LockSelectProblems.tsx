
import { Card } from "@/components/ui/card"


export function LockSelectProblems() {
    return (
        <div className="grid place-items-center">
            <Card className="bg-card p-4 rounded-md shadow-sm w-full max-w-md h-[500px]">

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