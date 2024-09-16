"use client";
import { LANGUAGE_MAPPING } from "@repo/common/language";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { SubmitProblem } from "./SubmitProblem";

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


export const ProblemSubmitBar = ({
    problem,
    contestId,
}: {
    problem: IProblem;
    contestId?: string;
}) => {
    const [language, setLanguage] = useState(
        Object.keys(LANGUAGE_MAPPING)[0] as string
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md ">
            <div className="flex justify-between items-center mb-4">
                 <LanguageSelector language={language} setLanguage={setLanguage} />
            </div>
                <SubmitProblem problem={problem} contestId={contestId} language={language} />
        </div>
    )
};

