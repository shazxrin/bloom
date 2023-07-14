import {useTaskStore} from "../../stores/taskStore.ts"
import {useCallback, useEffect, useState} from "react"
import {
    ActionIcon,
    Box,
    Center,
    Group,
    LoadingOverlay,
    Pagination,
    Skeleton,
    Table,
    Title,
    useMantineTheme
} from "@mantine/core"
import {useCategoryStore} from "../../stores/categoryStore.ts"
import {format, formatDuration, secondsToHours, secondsToMinutes} from "date-fns"
import CategoryBadge from "../category/CategoryBadge.tsx"
import {ListTaskDto} from "../../api/dto.ts"
import {IconPencil, IconTrash} from "@tabler/icons-react"
import {modals} from "@mantine/modals"

const dateTimeFormat = "dd MMMM yyyy HH:mm"

export default function HistoryTaskTable() {
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [tasks, setTasks] = useState<Array<ListTaskDto>>([])

    const {getAllTasks} = useTaskStore((state) => ({
        getAllTasks: state.getAllTasks
    }))

    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const fetchPage = useCallback(async () => {
        setIsLoading(true)
        const pagedList = await getAllTasks(page - 1)
        setTasks(pagedList?.items ?? [])
        setTotalPages(pagedList?.totalPages ?? 0)
        setIsLoading(false)
    }, [page])

    useEffect(() => {
        fetchPage()
    }, [fetchPage])

    const theme = useMantineTheme()

    return (
        <Box pos={"relative"}>
            <LoadingOverlay visible={isLoading} transitionDuration={500} overlayOpacity={0.75}
                            overlayBlur={0.2} overlayColor={theme.colors.dark[8]}/>

            <Table verticalSpacing={"md"} striped={true} highlightOnHover={true}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Duration</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading &&
                        Array.from({length: 10}, (_, i) => (
                            <tr key={i}>
                                {Array.from({length: 5}, (_, j) => <td key={j}><Skeleton height={12} radius="xl" /></td>)}
                            </tr>
                        ))
                    }
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.name}</td>
                            <td>
                                <CategoryBadge
                                    name={categories.find(c => c.id === task.categoryId)?.name ?? ""}
                                    color={categories.find(c => c.id === task.categoryId)?.color ?? ""}/>
                            </td>
                            <td>
                                {formatDuration({
                                    hours: secondsToHours(task.duration),
                                    minutes: secondsToMinutes(task.duration) - (secondsToHours(task.duration) * 60),
                                    seconds: task.duration - (secondsToMinutes(task.duration) * 60)
                                })}
                            </td>
                            <td>{format(new Date(task.startTime), dateTimeFormat)}</td>
                            <td>{task.endTime ? format(new Date(task.endTime), dateTimeFormat) : "In Progress"}</td>
                            <td>
                                <Group>
                                    <ActionIcon onClick={() => modals.openContextModal({
                                        modal: "taskFormModal",
                                        title: <Title order={5}>Update Task</Title>,
                                        innerProps: {
                                            mode: "update",
                                            task: task
                                        }
                                    })}>
                                        <IconPencil />
                                    </ActionIcon>
                                    <ActionIcon onClick={() => modals.openContextModal({
                                        modal: "taskDeleteModal",
                                        title: <Title order={5}>Delete Task</Title>,
                                        innerProps: {
                                            task: task
                                        }
                                    })}>
                                        <IconTrash />
                                    </ActionIcon>
                                </Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Center>
                <Pagination color={"pink"} total={totalPages} value={page} onChange={setPage} mt={16}/>
            </Center>
        </Box>
    )
}