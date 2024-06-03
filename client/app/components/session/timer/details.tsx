import { Center, Stack } from "@mantine/core"
import SessionTimerDetailsActions from "~/components/session/timer/details-actions"
import TimerClock from "~/components/session/timer/details-clock"
import SessionTimerDetailsInfo from "~/components/session/timer/details-info"

type SessionTimerDetailsProps = {
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

const SessionTimerDetails = ({
    name,
    tag,
    status,
    totalDuration,
    remainingDuration,
    startDateTime,
    resumeDateTime
}: SessionTimerDetailsProps) => {
    return (
        <Center h="100%" w="100%">
            <Stack gap={ 32 } align="center">
                <SessionTimerDetailsInfo name={ name } tag={ tag }/>
                <TimerClock
                    name={ name }
                    startDateTime={ startDateTime }
                    remainingDuration={ remainingDuration }
                    status={ status }
                    totalDuration={ totalDuration }
                    resumeDateTime={ resumeDateTime }
                />
                <SessionTimerDetailsActions
                    status={ status }
                    resumeDateTime={ resumeDateTime }
                    remainingDuration={ remainingDuration }
                />
            </Stack>
        </Center>
    )
}

export default SessionTimerDetails
