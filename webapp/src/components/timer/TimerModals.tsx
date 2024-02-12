import {Button, Center, Title} from "@mantine/core"
import {IconSparkles} from "@tabler/icons-react"
import {modals} from "@mantine/modals"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"

export default function TimerModals() {
    const {currentTask} = useCurrentTaskStore((state) => ({
        currentTask: state.currentTask,
    }))

    return (
        <>
            {!currentTask &&
                <Center>
                    <Button leftSection={<IconSparkles/>}
                        variant={"subtle"}
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
