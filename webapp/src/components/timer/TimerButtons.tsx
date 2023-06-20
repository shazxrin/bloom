import {ActionIcon, Group, useMantineTheme} from "@mantine/core";
import {IconPlayerPause, IconPlayerPlay, IconPlayerStop} from "@tabler/icons-react";

interface TimerButtonsProps {
    hasTask: boolean;
    isPaused: boolean;
    onPauseButtonClick: () => void;
    onPlayButtonClick: () => void;
    onStopButtonClick: () => void;
}

export default function TimerButtons({hasTask, isPaused, onPauseButtonClick, onPlayButtonClick, onStopButtonClick}: TimerButtonsProps) {
    const theme = useMantineTheme();

    return (
        <Group position={"center"}>
            <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                        disabled={hasTask ? isPaused : true}
                        onClick={onPauseButtonClick}>
                <IconPlayerPause color={theme.colors.yellow[7]}/>
            </ActionIcon>
            <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                        disabled={hasTask ? !isPaused : false}
                        onClick={onPlayButtonClick}>
                <IconPlayerPlay color={theme.colors.green[7]}/>
            </ActionIcon>
            <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                        disabled={!hasTask}
                        onClick={onStopButtonClick}>
                <IconPlayerStop color={theme.colors.red[7]}/>
            </ActionIcon>
        </Group>
    );
}