import { addSeconds, differenceInSeconds, format } from "date-fns"
import { useEffect, useState } from "react"
import { Group, Progress, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconAlarm, IconChevronsRight } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { useCheckNativeNotification, useShowNativeNotification } from "~/hooks/native-notification"

type TimerSessionClockProps = {
    name: string
    status: "RUNNING" | "PAUSED" | "COMPLETED"
    totalDuration: number
    remainingDuration: number
    startDateTime: string
    resumeDateTime: string
}

const TimerSessionClock = ({
    name,
    status,
    totalDuration,
    remainingDuration,
    startDateTime,
    resumeDateTime,
}: TimerSessionClockProps) => {
    const initialRemainingSeconds = status === "PAUSED"
        ? remainingDuration
        : remainingDuration - differenceInSeconds(new Date(), resumeDateTime)
    const [countdownSeconds, setCountdownSeconds] = useState(initialRemainingSeconds)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (status === "PAUSED") {
                return
            }

            const updatedRemainingSeconds = remainingDuration - differenceInSeconds(new Date(), resumeDateTime)
            setCountdownSeconds(updatedRemainingSeconds)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [status])

    useCheckNativeNotification()
    const { showNativeNotification } = useShowNativeNotification()

    const [hours, setHours] = useState("00")
    const [minutes, setMinutes] = useState("00")
    const [seconds, setSeconds] = useState("00")
    useEffect(() => {
        const absCountdownSeconds = Math.abs(countdownSeconds)
        setHours(String(Math.floor(absCountdownSeconds / 3600)).padStart(2, "0"))
        setMinutes(String(Math.floor((absCountdownSeconds % 3600) / 60)).padStart(2, "0"))
        setSeconds(String(absCountdownSeconds % 60).padStart(2, "0"))

        if (countdownSeconds === 0) {
            notifications.show({
                title: "Times up!",
                message: `Your timer for ${ name } has completed`,
                color: "green",
                icon: <IconAlarm size={ 18 }/>,
            })
            showNativeNotification("Times up!", `Your timer for ${ name } has completed`)
        }
    }, [countdownSeconds])

    const color = countdownSeconds < 0
        ? "blue"
        : (status === "RUNNING"
                ? "green"
                : "orange"
        )

    return (
        <Stack>
            <Text size="80px" ff="mono" fw="500" c={ color }>
                { hours }:{ minutes }:{ seconds }
            </Text>

            <Progress
                value={ (1 - (Math.max(countdownSeconds, 0) / totalDuration)) * 100 }
                animated={ status === "RUNNING" }
                radius="xs"
                color={ color }
            />
            <Group justify="space-between">
                <Text ff="mono" c="dimmed">
                    { format(startDateTime, "HH:mm") }
                </Text>

                <ThemeIcon variant="transparent" color="grey">
                    <IconChevronsRight size={ 16 }/>
                </ThemeIcon>

                <Text ff="mono" c="dimmed">
                    { status === "PAUSED" ? "??:??" : format(addSeconds(resumeDateTime, remainingDuration), "HH:mm") }
                </Text>
            </Group>
        </Stack>
    )
}

export default TimerSessionClock
