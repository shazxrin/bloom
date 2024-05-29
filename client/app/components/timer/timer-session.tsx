import { Center, Stack } from "@mantine/core"
import TimerSessionActions from "~/components/timer/timer-session-actions"
import TimerClock from "~/components/timer/timer-session-clock"
import TimerSessionInfo from "~/components/timer/timer-session-info"

type TimerSessionProps = {
    name: string
    tag: {
        name: string
        color: string
    }
    status: "RUNNING" | "PAUSED" | "COMPLETED"
    totalDuration: number
    remainingDuration: number
    startDateTime: string
    resumeDateTime: string
}

const TimerSession = ({
    name,
    tag,
    status,
    totalDuration,
    remainingDuration,
    startDateTime,
    resumeDateTime
}: TimerSessionProps) => {
    return (
        <Center h="100%" w="100%">
            <Stack gap={ 32 } align="center">
                <TimerSessionInfo name={ name } tag={ tag }/>
                <TimerClock
                    name={ name }
                    startDateTime={ startDateTime }
                    remainingDuration={ remainingDuration }
                    status={ status }
                    totalDuration={ totalDuration }
                    resumeDateTime={ resumeDateTime }
                />
                <TimerSessionActions
                    status={ status }
                    resumeDateTime={ resumeDateTime }
                    remainingDuration={ remainingDuration }
                />
            </Stack>
        </Center>
    )
}

export default TimerSession
