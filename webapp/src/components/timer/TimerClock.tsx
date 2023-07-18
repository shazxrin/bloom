import {useEffect, useState} from "react"
import {differenceInSeconds} from "date-fns"
import {Group, Text, useMantineTheme} from "@mantine/core"
import useMobile from "../../hooks/useMobile.ts"
import {useTaskStore} from "../../stores/taskStore.ts"

interface TimerClockTextProps {
    color: string
    value: number
}

function TimerClockText({color, value}: TimerClockTextProps) {
    const isMobile = useMobile()

    return (
        <Text size={isMobile ? "5rem" : "8rem"} weight={"bold"} color={color} ff={"DM Mono"}>
            {String(value).padStart(2, "0")}
        </Text>
    )
}

export default function TimerClock() {
    const {currentTask} = useTaskStore((state) => ({
        currentTask: state.currentTask,
    }))

    const [leftDuration, setLeftDuration] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const [timerIntervalId, setTimerIntervalId] = useState(0)
    useEffect(() => {
        if (currentTask && !currentTask.isPaused) {
            const id = setInterval(() => {
                setLeftDuration(currentTask.remainingDuration - differenceInSeconds(new Date(), new Date(currentTask.lastStartTime)))
            }, 1000)

            setTimerIntervalId(id)

            return () => clearInterval(id)
        } else {
            clearInterval(timerIntervalId)
        }
    }, [currentTask])

    useEffect(() => {
        const leftDuration = currentTask ? currentTask.remainingDuration - differenceInSeconds(new Date(), new Date(currentTask.lastStartTime)) : 0

        setLeftDuration(leftDuration)
    }, [currentTask])

    useEffect(() => {
        const hours = Math.max(Math.floor(Math.abs(leftDuration) / 3600), 0)
        const minutes = Math.max(Math.floor((Math.abs(leftDuration) - (hours * 3600)) / 60), 0)
        const seconds = Math.max(Math.floor(Math.abs(leftDuration) - (hours * 3600) - (minutes * 60)), 0)

        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
    }, [leftDuration])

    const theme = useMantineTheme()
    const pausedColor = theme.colors.yellow[8]
    const neutralColor = theme.colors.gray[8]
    const ongoingColor = theme.colors.green[8]
    const doneColor = theme.colors.blue[8]
    const [timerColor, setTimerColor] = useState(neutralColor)
    useEffect(() => {
        if (currentTask) {
            if (currentTask.isPaused) {
                setTimerColor(pausedColor)
            } else {
                if (leftDuration > 0) {
                    setTimerColor(ongoingColor)
                } else {
                    setTimerColor(doneColor)
                }
            }
        } else {
            setTimerColor(neutralColor)
        }
    }, [currentTask, leftDuration])

    return (
        <Group spacing={"xl"}>
            <TimerClockText color={timerColor} value={hours}/>
            <TimerClockText color={timerColor} value={minutes}/>
            <TimerClockText color={timerColor} value={seconds}/>
        </Group>
    )
}
