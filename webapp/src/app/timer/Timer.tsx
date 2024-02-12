import {
    Center,
    Stack
} from "@mantine/core"
import TimerClock from "../../components/timer/TimerClock.tsx"
import TimerButtons from "../../components/timer/TimerButtons.tsx"
import TimerLabel from "../../components/timer/TimerLabel.tsx"
import TimerModals from "../../components/timer/TimerModals.tsx"
import {useEffect} from "react"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useShellStore from "../../stores/shellStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"

export default function Timer() {
    const {fetchCurrentTask} = useCurrentTaskStore((state) => ({
        fetchCurrentTask: state.fetchCurrentTask
    }))
    const {fetchCategories} = useCategoryStore((state) => ({
        fetchCategories: state.fetchCategories,
    }))

    const {setRefreshCallback} = useShellStore((state) => ({
        setRefreshCallback: state.setRefreshCallback
    }))

    useEffect(() => {
        fetchCurrentTask()
        fetchCategories()

        setRefreshCallback(() => {
            fetchCurrentTask()
            fetchCategories()
        })
    }, [])

    return (
        <Center w={"100%"} h={"100%"}>
            <Stack align="center">
                <TimerLabel/>
                <TimerClock/>
                <TimerButtons/>
                <TimerModals/>
            </Stack>
        </Center>
    )
}