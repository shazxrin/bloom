import {useEffect, useState} from "react";
import {differenceInSeconds} from "date-fns";
import {Group, Text, useMantineTheme} from "@mantine/core";
import useMobile from "../../hooks/useMobile.ts";

interface TimerClockProps {
    remainingDuration: number;
    lastStartTime: Date;
    isPaused: boolean;
    hasTask: boolean;
}

export default function TimerClock({remainingDuration, lastStartTime, isPaused, hasTask}: TimerClockProps) {
    const [leftDuration, setLeftDuration] = useState(remainingDuration);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (hasTask && !isPaused) {
            const timer = setInterval(() => {
                setLeftDuration(remainingDuration - differenceInSeconds(new Date(), lastStartTime));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingDuration, lastStartTime, hasTask, isPaused]);

    useEffect(() => {
        setLeftDuration(remainingDuration);
    }, [remainingDuration]);

    useEffect(() => {
        const hours = Math.max(Math.floor(Math.abs(leftDuration) / 3600), 0);
        const minutes = Math.max(Math.floor((Math.abs(leftDuration) - (hours * 3600)) / 60), 0);
        const seconds = Math.max(Math.floor(Math.abs(leftDuration) - (hours * 3600) - (minutes * 60)), 0);

        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
    }, [leftDuration]);

    const theme = useMantineTheme();
    const pausedColor = theme.colors.yellow[8];
    const neutralColor = theme.colors.gray[8];
    const ongoingColor = theme.colors.green[8];
    const doneColor = theme.colors.blue[8];
    const [timerColor, setTimerColor] = useState(neutralColor);
    useEffect(() => {
        if (hasTask) {
            if (isPaused) {
                setTimerColor(pausedColor)
            } else {
                if (leftDuration > 0) {
                    setTimerColor(ongoingColor);
                } else {
                    setTimerColor(doneColor)
                }
            }
        } else {
            setTimerColor(neutralColor);
        }
    }, [hasTask, isPaused, leftDuration]);

    const isMobile = useMobile();

    return (
        <Group spacing={"xl"}>
            <Text size={isMobile ? "5rem" : "8rem"} weight={"bold"} color={timerColor} ff={"DM Mono"}>
                {String(hours).padStart(2, "0")}
            </Text>
            <Text size={isMobile ? "5rem" : "8rem"} weight={"bold"} color={timerColor} ff={"DM Mono"}>
                {String(minutes).padStart(2, "0")}
            </Text>
            <Text size={isMobile ? "5rem" : "8rem"} weight={"bold"} color={timerColor} ff={"DM Mono"}>
                {String(seconds).padStart(2, "0")}
            </Text>
        </Group>
    );
}
