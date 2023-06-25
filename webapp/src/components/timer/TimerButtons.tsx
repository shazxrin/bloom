import {ActionIcon, Group, useMantineTheme} from "@mantine/core";
import {IconPlayerPause, IconPlayerPlay, IconPlayerStop} from "@tabler/icons-react";
import {useTimerStore} from "../../stores/timerStore.tsx";
import FadeTransition from "../misc/FadeTransition.tsx";

export default function TimerButtons() {
    const {
        currentTask,
        resumeCurrentTask,
        pauseCurrentTask,
        endCurrentTask
    } = useTimerStore((state) => ({
        currentTask: state.currentTask,
        resumeCurrentTask: state.resumeCurrentTask,
        pauseCurrentTask: state.pauseCurrentTask,
        endCurrentTask: state.endCurrentTask,
    }))

    const theme = useMantineTheme();

    return (
        <FadeTransition trigger={!!currentTask}>
            <Group position={"center"}>
                <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                            disabled={currentTask?.isPaused ?? true}
                            onClick={pauseCurrentTask}>
                    <IconPlayerPause color={theme.colors.yellow[7]}/>
                </ActionIcon>
                <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                            disabled={!(currentTask?.isPaused) ?? false}
                            onClick={resumeCurrentTask}>
                    <IconPlayerPlay color={theme.colors.green[7]}/>
                </ActionIcon>
                <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                            disabled={!currentTask}
                            onClick={endCurrentTask}>
                    <IconPlayerStop color={theme.colors.red[7]}/>
                </ActionIcon>
            </Group>
        </FadeTransition>
    )
}