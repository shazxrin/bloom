import {
    Center,
    Stack
} from "@mantine/core"
import TimerClock from "../../components/timer/TimerClock.tsx"
import TimerButtons from "../../components/timer/TimerButtons.tsx"
import TimerLabel from "../../components/timer/TimerLabel.tsx"
import TimerModals from "../../components/timer/TimerModals.tsx"

export default function Timer() {
    return (
        <Center w={"100%"} h={"100%"}>
            <Stack>
                <TimerLabel/>
                <TimerClock/>
                <TimerButtons/>
                <TimerModals/>
            </Stack>
        </Center>
    )
}