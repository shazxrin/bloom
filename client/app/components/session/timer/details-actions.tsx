import { ActionIcon, Group } from "@mantine/core"
import { Form } from "@remix-run/react"
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react"
import { differenceInSeconds } from "date-fns"
import { useEffect, useState } from "react"

type SessionTimerDetailsActionsProps = {
    status: "RUNNING" | "PAUSED" | "COMPLETED"
    resumeDateTime: string
    remainingDuration: number
}

const SessionTimerDetailsActions = ({ status, resumeDateTime, remainingDuration }: SessionTimerDetailsActionsProps) => {
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

    return (
        <Group gap={ 16 } justify="center">
            <Form method="POST" action="/client/app/routes/session.timer">
                <input type="hidden" name="intent" value="resume"/>
                <ActionIcon
                    size="lg"
                    variant="outline"
                    color="green"
                    disabled={ status === "RUNNING" }
                    type="submit"
                >
                    <IconPlayerPlay/>
                </ActionIcon>
            </Form>

            <Form method="POST" action="/client/app/routes/session.timer">
                <input type="hidden" name="intent" value="pause"/>
                <ActionIcon
                    size="lg"
                    variant="outline"
                    color="orange"
                    disabled={ status === "PAUSED" || countdownSeconds <= 0 }
                    type="submit"
                >
                    <IconPlayerPause/>
                </ActionIcon>
            </Form>

            <Form method="POST" action="/client/app/routes/session.timer">
                <input type="hidden" name="intent" value="end"/>
                <ActionIcon
                    size="lg"
                    variant="outline"
                    color="red"
                    type="submit"
                >
                    <IconPlayerStop/>
                </ActionIcon>
            </Form>
        </Group>
    )
}

export default SessionTimerDetailsActions
