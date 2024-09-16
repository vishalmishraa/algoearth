"use client"
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Submissions } from "./Submissions";
import { ProblemStatement } from "./ProblemStatement";

export function ProblemDetail({ problem }: { problem: any }) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <Tabs
                    defaultValue="problem"
                    className="rounded-md"
                    value={activeTab}
                    onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 w-48 gap-2">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            {activeTab === "submissions" && <Submissions problem={problem} />}
            {activeTab === "description" && (
                <ProblemStatement description={problem.description} tags={problem.tags} title={problem.title} />
            )}
        </div>
    )
}
