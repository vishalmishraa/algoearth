"use client";
import { useState } from "react";
import { Submissions } from "./problem-page/Submissions";
import { SubmitProblem } from "./problem-page/SubmitProblem";
import { LanguageSelector } from "./problem-page/LanguageSelector";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LANGUAGE_MAPPING } from "@repo/common/language";

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
    const [activeTab, setActiveTab] = useState("problem");
    const [language, setLanguage] = useState(
        Object.keys(LANGUAGE_MAPPING)[0] as string
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <Tabs
                    defaultValue="problem"
                    className="rounded-md"
                    value={activeTab}
                    onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 w-48 gap-2">
                        <TabsTrigger value="problem">Submit</TabsTrigger>
                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>
                </Tabs>
                {activeTab === "problem" && <LanguageSelector language={language} setLanguage={setLanguage}/>}
            </div>
            <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
                <SubmitProblem problem={problem} contestId={contestId} language={language} />
            </div>
            {activeTab === "submissions" && <Submissions problem={problem} />}
        </div>
    )
};

