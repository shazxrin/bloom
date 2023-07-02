import {Center, Group, Text, useMantineTheme} from "@mantine/core"
import {IconArrowRight} from "@tabler/icons-react"
import {useTaskStore} from "../../stores/taskStore.ts"
import {useCategoryStore} from "../../stores/categoryStore.ts"
import CategoryBadge from "../category/CategoryBadge.tsx"

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
                        <CategoryBadge name={categoryName} color={categoryColor}/>
                        <IconArrowRight size={18}></IconArrowRight>
                    </>
                }


                <Text color={theme.colors.gray[6]} size={"sm"}>
                    {currentTask?.name ?? "No current task"}
                </Text>
            </Group>
        </Center>
    )
}