import { useCallback, useEffect, useState } from "react"
import {
    ActionIcon,
    Box,
    Group,
    Pagination,
    Stack,
    Table,
    Tooltip,
    Text,
    Button
} from "@mantine/core"
import useCategoryStore from "../../stores/categoryStore.ts"
import { format, formatDuration, secondsToHours, secondsToMinutes } from "date-fns"
import CategoryBadge from "../category/CategoryBadge.tsx"
import {
    IconArrowLeft,
    IconArrowRight,
    IconPencil,
    IconPlus,
    IconTrash
} from "@tabler/icons-react"
import { modals } from "@mantine/modals"
import useHistoryTaskStore from "../../stores/taskHistoryStore.ts"
import useShellStore from "../../stores/shellStore.ts"

const dateTimeFormat = "dd/MM/yyyy HH:mm"

export default function HistoryTaskTable() {
    const [page, setPage] = useState(1)

    const { tasks, totalPages, getAllTasks } = useHistoryTaskStore((state) => ({
        tasks: state.tasks,
        totalPages: state.totalPages,
        getAllTasks: state.getAllTasks
    }))

    const { categories, fetchCategories } = useCategoryStore((state) => ({
        categories: state.categories,
        fetchCategories: state.fetchCategories
    }))

    const { setRefreshCallback } = useShellStore((state) => ({
        setRefreshCallback: state.setRefreshCallback
    }))

    const fetchPage = useCallback(() => {
        getAllTasks(page - 1)
    }, [page])
    useEffect(() => {
        fetchPage()
    }, [fetchPage])

    useEffect(() => {
        fetchCategories()

        setRefreshCallback(() => {
            fetchPage()
            fetchCategories()
        })
    }, [])

    return (
        <Stack>
            <Group gap={"xs"}>
                <Button
                    size={"sm"}
                    color={"green"}
                    variant={"light"}
                    leftSection={<IconPlus size={18} />}
                    onClick={() => modals.openContextModal({
                        modal: "taskFormModal",
                        title: <Text size={"sm"}>Add Task</Text>,
                        innerProps: {
                            mode: "add",
                        }
                    })}>
                    Add
                </Button>
            </Group>

            <Stack>
                <Box w={"100%"} style={{
                    overflowX: "auto",
                    overflowY: "hidden"
                }}>
                    <Table verticalSpacing={"md"} striped={true} miw={840}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Category</Table.Th>
                                <Table.Th>Duration</Table.Th>
                                <Table.Th>Start Time</Table.Th>
                                <Table.Th>End Time</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tasks.map((task) => (
                                <Table.Tr key={task.id}>
                                    <Table.Td>
                                        <Text w={150} truncate={"end"}>{task.name}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <CategoryBadge
                                            name={categories.find(c => c.id === task.categoryId)?.name ?? ""}
                                            color={categories.find(c => c.id === task.categoryId)?.color ?? ""} />
                                    </Table.Td>
                                    <Table.Td>
                                        <Text w={120}>
                                            {formatDuration({
                                                hours: secondsToHours(task.duration),
                                                minutes: secondsToMinutes(task.duration) - (secondsToHours(task.duration) * 60),
                                                seconds: task.duration - (secondsToMinutes(task.duration) * 60)
                                            })}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text w={120} truncate={"end"}>
                                            {format(new Date(task.startTime), dateTimeFormat)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text w={120} truncate={"end"}>
                                            {task.endTime ? format(new Date(task.endTime), dateTimeFormat) : "In Progress"}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap={"xs"}>
                                            <Tooltip label={"Edit"}>
                                                <ActionIcon
                                                    variant={"light"}
                                                    color={"orange"}
                                                    onClick={() => modals.openContextModal({
                                                        modal: "taskFormModal",
                                                        title: <Text size={"sm"}>Update Task</Text>,
                                                        innerProps: {
                                                            mode: "update",
                                                            task: task,
                                                        }
                                                    })}>
                                                    <IconPencil size={20} />
                                                </ActionIcon>
                                            </Tooltip>

                                            <Tooltip label={"Delete"}>
                                                <ActionIcon
                                                    variant={"light"}
                                                    color={"red"}
                                                    onClick={() => modals.openContextModal({
                                                        modal: "taskDeleteModal",
                                                        title: <Text size={"sm"}>Delete Task</Text>,
                                                        innerProps: {
                                                            task: task,
                                                        }
                                                    })}>
                                                    <IconTrash size={20} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Box>

                <Stack align={"center"}>
                    <Pagination
                        color={"pink"}
                        total={totalPages}
                        value={page}
                        onChange={setPage}
                        nextIcon={IconArrowRight}
                        previousIcon={IconArrowLeft} />
                </Stack>
            </Stack>
        </Stack>
    )
}