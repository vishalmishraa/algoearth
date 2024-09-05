import { CheckIcon, CircleX, ClockIcon } from "lucide-react";

enum SubmitStatus {
    SUBMIT = "SUBMIT",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    FAILED = "FAILED",
}


export interface IProblem {
    id: string;
    title: string;
    description: string;
    slug: string;
    defaultCode: {
        languageId: number;
        code: string;
    }[];
};

export function testStatus(status: number | null) {
    switch (status) {
        case 1:
            return <ClockIcon className="h-6 w-6 text-yellow-500" />;
        case 2:
            return <ClockIcon className="h-6 w-6 text-yellow-500" />;
        case 3:
            return <CheckIcon className="h-6 w-6 text-green-500" />;
        case 4:
            return <CircleX className="h-6 w-6 text-red-500" />;
        case 5:
            return <ClockIcon className="h-6 w-6 text-red-500" />;
        case 6:
            return <CircleX className="h-6 w-6 text-red-500" />;
        case 13:
            return <div className="text-gray-500">Internal Error!</div>;
        case 14:
            return <div className="text-gray-500">Exec Format Error!</div>;
        default:
            return <div className="text-gray-500">Runtime Error!</div>;
    }
}