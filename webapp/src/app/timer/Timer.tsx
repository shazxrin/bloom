import {
    Center,
    Stack
} from "@mantine/core"
import TimerClock from "../../components/timer/TimerClock.tsx"
import TimerButtons from "../../components/timer/TimerButtons.tsx"
import TimerLabel from "../../components/timer/TimerLabel.tsx"
import {useRoute} from "wouter"
import FadeTransition from "../../components/misc/FadeTransition.tsx";
import {useEffect} from "react";
import {useTimerStore} from "../../stores/timerStore.tsx";
import TimerModals from "../../components/timer/TimerModals.tsx";

export default function Timer() {
    const [routeMatched, _] = useRoute("/timer")
    const {initialize} = useTimerStore((state) => ({
        initialize: state.initialize
    }))

    useEffect(() => {
        initialize()
    }, [])

    return (
        <FadeTransition trigger={routeMatched}>
            <Center w={"100%"} h={"100%"}>
                <Stack>
                    <TimerLabel/>
                    <TimerClock/>
                    <TimerButtons/>
                    <TimerModals/>
                </Stack>
            </Center>
        </FadeTransition>
    )
}