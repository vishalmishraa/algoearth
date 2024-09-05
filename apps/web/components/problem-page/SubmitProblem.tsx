import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Turnstile } from '@marsidev/react-turnstile';
import Editor from "@monaco-editor/react";
import { LANGUAGE_MAPPING } from "@repo/common/language";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { RenderTestcase } from "./RenderTestcase";


const CLOUD_FLARE_TURNSTILE_SITE_KEY: string = process.env.NEXT_PUBLIC_CLOUD_FLARE_TURNSTILE_SITE_KEY || "0x4AAAAAAAgNypsUam0USvCa";

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





export function SubmitProblem({
    problem,
    contestId,
    language
}: {
    problem: IProblem;
    contestId?: string;
    language:string;
}) {

    const [code, setCode] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
    const [testcases, setTestcases] = useState<any[]>([]);
    const [token, setToken] = useState<string>("");
    const session = useSession();

    useEffect(() => {
        const defaultCode: { [key: string]: string } = {};
        problem.defaultCode.forEach((code) => {
            const language = Object.keys(LANGUAGE_MAPPING).find(
                (language) => LANGUAGE_MAPPING[language]?.internal === code.languageId
            );
            if (!language) return;
            defaultCode[language] = code.code;
        });
        setCode(defaultCode);
    }, [problem]);

    async function pollWithBackoff(id: string, retries: number) {

        if (retries === 0) {
            setStatus(SubmitStatus.SUBMIT);
            toast.error("Not able to get status ");
            return;
        }

        const response = await axios.get(`/api/submission/?id=${id}`);

        if (response.data.submission.status === "PENDING") {
            setTestcases(response.data.submission.testcases);
            await new Promise((resolve) => setTimeout(resolve, 2.5 * 1000));
            pollWithBackoff(id, retries - 1);
        } else {
            if (response.data.submission.status === "AC") {
                setStatus(SubmitStatus.ACCEPTED);
                setTestcases(response.data.submission.testcases);
                return toast.success("Accepted!");
            } else {
                setStatus(SubmitStatus.FAILED);
                toast.error("Failed :(");
                setTestcases(response.data.submission.testcases);
                return;
            }
        }
    }

    async function submit() {
        setStatus(SubmitStatus.PENDING);
        setTestcases((t) => t.map((tc) => ({ ...tc, status: "PENDING" })));
        try {
            const response = await axios.post(`/api/submission/`, {
                code: code[language],
                languageId: language,
                problemId: problem.id,
                activeContestId: contestId,
                token: token,
            });

            console.log(response.data)

            if (response.data.status === 429) {
                setStatus(SubmitStatus.FAILED);
                toast.error("Try again after sometime");
                return;
            };

            if (response.data.status === 400) {
                setStatus(SubmitStatus.FAILED);
                toast.error(`error : ${response.data.message}`);
                return;
            }

            if (response.data.status != 200) {
                setStatus(SubmitStatus.FAILED);
                toast.error("Something went wrong");
                return;
            };

            pollWithBackoff(response.data.id, 30);
        } catch (e) {
            //@ts-ignore
            toast.error(e.response.statusText);
            setStatus(SubmitStatus.SUBMIT);
        }
    }

    return (
        <div>
            <div className="pt-4 rounded-md">
                <Editor
                    height={"60vh"}
                    value={code[language]}
                    theme="vs-dark"
                    onMount={() => { }}
                    options={{
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        
                    }}
                    language={LANGUAGE_MAPPING[language]?.monaco}
                    onChange={(value) => {
                        //@ts-ignore
                        setCode({ ...code, [language]: value });
                    }}
                    defaultLanguage="cpp"

                />
            </div>
            <div className="flex justify-end">
                {
                    process.env.NODE_ENV === "production" && (
                        <Turnstile onSuccess={(token: any) => {
                            setToken(token)
                        }} siteKey={CLOUD_FLARE_TURNSTILE_SITE_KEY} />
                    )
                }
                <Button
                    disabled={status === SubmitStatus.PENDING}
                    type="submit"
                    className="mt-4 align-right"
                    onClick={session.data?.user ? submit : () => signIn()}>
                    {session.data?.user
                        ? status === SubmitStatus.PENDING
                            ? "Submitting"
                            : "Submit"
                        : "Login to submit"}
                </Button>
            </div>
            <RenderTestcase testcases={testcases} />
        </div>
    );
};
