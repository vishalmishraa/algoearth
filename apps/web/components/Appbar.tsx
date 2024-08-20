"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { ButtonLoading } from "./Loading";
import { Code, Trophy, BookOpen, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { usePathname } from 'next/navigation';

export function Appbar() {
    const { data: session, status: sessionStatus } = useSession();
    const isLoading = sessionStatus === "loading";
    const pathname = usePathname();

    const showContestCreatorHub = pathname === '/' || pathname === '/contests';

    return (
        <header className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-4 md:px-6 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105" prefetch={false}>
                    <Code className="h-8 w-8" />
                    <span className="text-2xl font-bold">AlgoEarth</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/contests" className="flex items-center gap-2 hover:text-indigo-200 transition-colors" prefetch={false}>
                        <Trophy className="h-5 w-5" />
                        <span>Contests</span>
                    </Link>
                    <Link href="/problems" className="flex items-center gap-2 hover:text-indigo-200 transition-colors" prefetch={false}>
                        <BookOpen className="h-5 w-5" />
                        <span>Problems</span>
                    </Link>
                </nav>
                {!isLoading && session?.user && (
                    <div className="flex items-center gap-4">
                        {showContestCreatorHub && (
                            <Link href="/contests-dashboard" prefetch={false}>
                                <Button className="bg-green-600 text-white hover:bg-green-700 transition-colors">
                                    <LayoutDashboard className="h-5 w-5 mr-2" />
                                    Contest Creator Hub
                                </Button>
                            </Link>
                        )}
                        <Button onClick={() => signOut()} variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600 transition-colors">
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                        </Button>
                    </div>
                )}

                {!isLoading && !session?.user && (
                    <div className="flex items-center gap-4">
                        <Button onClick={() => signIn()} variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600 transition-colors">
                            <LogIn className="h-5 w-5 mr-2" />
                            Sign in
                        </Button>
                    </div>
                )}

                {isLoading && <div className="flex items-center gap-4"><ButtonLoading /></div>}
            </div>
        </header>
    );
}