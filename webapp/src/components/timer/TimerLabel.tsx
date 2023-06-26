import {Badge, Center, Group, Text, useMantineTheme} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";
import tinycolor from "tinycolor2";
import {useTaskStore} from "../../stores/taskStore.ts";
import {useCategoryStore} from "../../stores/categoryStore.ts";

export default function TimerLabel() {
    const {currentTask} = useTaskStore((state) => ({
        currentTask: state.currentTask,
    }))

    const {categories} = useCategoryStore((state) => ({
        categories: state.categories,
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