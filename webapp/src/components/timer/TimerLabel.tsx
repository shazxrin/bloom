import {Center, Group, Text, useMantineTheme} from "@mantine/core"
import {IconArrowRight} from "@tabler/icons-react"
import CategoryBadge from "../category/CategoryBadge.tsx"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"

export default function TimerLabel() {
    const {currentTask} = useCurrentTaskStore((state) => ({
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
                        <CategoryBadge name={categoryName} color={categoryColor}/>
                        <IconArrowRight size={18}></IconArrowRight>
                    </>
                }


                <Text c={theme.colors.gray[6]} size={"sm"} maw={150} truncate={"end"}>
                    {currentTask?.name ?? "No current task"}
                </Text>
            </Group>
        </Center>
    )
}