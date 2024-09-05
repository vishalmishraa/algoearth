import axios from "axios";
import { useEffect, useState } from "react";
import { ISubmission, SubmissionTable } from "../SubmissionTable";
import { Loader2 } from "lucide-react";
import { SmallPageLoading } from "../Loading";

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

export function Submissions({ problem }: { problem: IProblem }) {
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/submission/bulk?problemId=${problem.id}`
            );
            setSubmissions(response.data.submissions || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <SmallPageLoading/>
            ) : (
                <SubmissionTable submissions={submissions} />
            )}
        </div>
    );
}