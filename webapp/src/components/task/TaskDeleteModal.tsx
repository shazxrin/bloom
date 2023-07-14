import {ContextModalProps} from "@mantine/modals"
import {Box, Button, Group, Text} from "@mantine/core"
import {ListTaskDto} from "../../api/dto.ts"
import {useTaskStore} from "../../stores/taskStore.ts"
import {IconTrash} from "@tabler/icons-react"

interface TaskDeleteModalProps {
    task: ListTaskDto
    onActionSuccess: () => void
}

export default function TaskDeleteModal({
                                            context,
                                            id,
                                            innerProps
                                        }: ContextModalProps<TaskDeleteModalProps>) {
    const {deleteTask} = useTaskStore((state) => ({
        deleteTask: state.deleteTask
    }))

    return (
        <Box py={8}>
            <Text mb={16}>
                Are you sure you want to delete <i>{innerProps.task.name}</i> ?
            </Text>
            <Group position={"right"}>
                <Button color={"red"}
                        variant={"outline"}
                        onClick={() => context.closeModal(id)}>
                    Cancel
                </Button>

                <Button leftIcon={<IconTrash size={18}/>}
                        color={"red"}
                        onClick={() => {
                            deleteTask(innerProps.task.id)
                                .then(innerProps.onActionSuccess)

                            context.closeContextModal(id)
                        }}>
                    Delete
                </Button>
            </Group>
        </Box>
    )
}