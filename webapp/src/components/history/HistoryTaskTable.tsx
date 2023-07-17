import {useTaskStore} from "../../stores/taskStore.ts"
import {useCallback, useEffect, useState} from "react"
import {ActionIcon, Button, Group, Loader, Pagination, Stack, Table, Title,} from "@mantine/core"
import {useCategoryStore} from "../../stores/categoryStore.ts"
import {format, formatDuration, secondsToHours, secondsToMinutes} from "date-fns"
import CategoryBadge from "../category/CategoryBadge.tsx"
import {ListTaskDto} from "../../api/dto.ts"
import {IconPencil, IconPlus, IconRefresh, IconTrash} from "@tabler/icons-react"
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

    return (
        <Stack>
            <Group position={"apart"}>
                <Group>
                    <Button color={"green"}
                            variant={"outline"}
                            leftIcon={<IconPlus size={18}/>}
                            onClick={() => modals.openContextModal({
                                modal: "taskFormModal",
                                title: <Title order={5}>Add Task</Title>,
                                innerProps: {
                                    mode: "add",
                                    onActionSuccess: () => fetchPage()
                                }
                            })}>
                        Add
                    </Button>

                    <Button color={"blue"}
                            variant={"outline"}
                            leftIcon={<IconRefresh size={18}/>}
                            onClick={() => fetchPage()}>
                        Refresh
                    </Button>

                    {isLoading && <Loader color={"blue"}/>}
                </Group>

                <Pagination color={"pink"}  total={totalPages} value={page} onChange={setPage}/>
            </Group>


            <Table verticalSpacing={"md"} striped={true}>
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
                            <Group spacing={"xs"}>
                                <ActionIcon onClick={() => modals.openContextModal({
                                    modal: "taskFormModal",
                                    title: <Title order={5}>Update Task</Title>,
                                    innerProps: {
                                        mode: "update",
                                        task: task,
                                        onActionSuccess: () => fetchPage()
                                    }
                                })}>
                                    <IconPencil size={20}/>
                                </ActionIcon>
                                <ActionIcon onClick={() => modals.openContextModal({
                                    modal: "taskDeleteModal",
                                    title: <Title order={5}>Delete Task</Title>,
                                    innerProps: {
                                        task: task,
                                        onActionSuccess: () => fetchPage()
                                    }
                                })}>
                                    <IconTrash size={20}/>
                                </ActionIcon>
                            </Group>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Stack>
    )
}