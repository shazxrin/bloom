import {Button, Center, Title} from "@mantine/core"
import {IconSparkles} from "@tabler/icons-react"
import {useTaskStore} from "../../stores/taskStore.ts"
import {modals} from "@mantine/modals"

export default function TimerModals() {
    const {
        currentTask,
    } = useTaskStore((state) => ({
        currentTask: state.currentTask,
    }))

    return (
        <>
            {!currentTask &&
                <Center>
                    <Button leftIcon={<IconSparkles/>}
                        variant={"subtle"} w={"50%"}
                        onClick={() => modals.openContextModal({
                            modal: "taskFormModal",
                            title: <Title order={5}>Create Current Task</Title>,
                            innerProps: {
                                mode: "create",
                            }
                        })}>
                        Create new task
                    </Button>
                </Center>
            }
        </>
    )
}
