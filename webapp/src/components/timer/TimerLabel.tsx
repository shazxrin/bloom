import {Badge, Center, Group, Text, useMantineTheme} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";
import tinycolor from "tinycolor2";
import {useTimerStore} from "../../stores/timerStore.tsx";

export default function TimerLabel() {
    const {currentTask, categories} = useTimerStore((state) => ({
        currentTask: state.currentTask,
        categories: state.categories
    }))

    const theme = useMantineTheme()

    const currentTaskCategory = categories.find(c => c.id == currentTask?.categoryId ?? "")
    const categoryColor = currentTaskCategory?.color ?? ""
    const categoryName = currentTaskCategory?.name ?? ""

    return (
        <Center>
            <Group align={"center"}>
                {!!currentTask &&
                    <>
                        <Badge sx={{
                            color: tinycolor(categoryColor).isLight() ? theme.colors.gray[8] : theme.colors.gray[3],
                            backgroundColor: categoryColor
                        }}>
                            {categoryName}
                        </Badge>
                        <IconArrowRight size={18}></IconArrowRight>
                    </>}


                <Text color={theme.colors.gray[6]} size={"sm"}>
                    {currentTask?.name ?? "No current task"}
                </Text>
            </Group>
        </Center>
    );
}