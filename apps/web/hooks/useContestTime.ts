"use client"

import { useEffect, useState } from "react";

export function useContestTime({ startTime, endTime }: { startTime: Date; endTime: Date }) {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [isStarted, setIsStarted] = useState(false);

    console.log({ startTime, endTime });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setCurrentTime(now);
            setIsStarted(now >= startTime.getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const timeLeft = isStarted
        ? Math.max(0, endTime.getTime() - currentTime)
        : Math.max(0, startTime.getTime() - currentTime);

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = formatTime(timeLeft);

    return {
        hours,
        minutes,
        seconds,
        timeLeft,
        currentTime,
        isStarted
    }
}