import {Button, Center, Modal, Overlay} from "@mantine/core";
import CreateTaskForm from "../task/CreateTaskForm.tsx";
import CreateCategoryForm from "../category/CreateCategoryForm.tsx";
import {useDisclosure} from "@mantine/hooks";
import {useTimerStore} from "../../stores/timerStore.tsx";
import {IconSparkles} from "@tabler/icons-react";
import FadeTransition from "../misc/FadeTransition.tsx";

export default function TimerModals() {
    const {
        currentTask,
        categories,
        createCurrentTask,
        createCategory,
    } = useTimerStore((state) => ({
        currentTask: state.currentTask,
        categories: state.categories,
        createCurrentTask: state.createCurrentTask,
        createCategory: state.createCategory,
    }))

    const [isCreateTaskModalOpened, {
        open: openCreateTaskModal,
        close: closeCreateTaskModal
    }] = useDisclosure(false)

    const [isCreateCategoryModalOpened, {
        open: openCreateCategoryModal,
        close: closeCategoryTaskModal
    }] = useDisclosure(false)

    return (
        <>
            <Overlay opacity={0.5} hidden={!isCreateTaskModalOpened} />

            <Modal title={"Create new task"}
                   centered
                   overlayProps={{opacity: 0}}
                   opened={isCreateTaskModalOpened}
                   onClose={closeCreateTaskModal}
                   hidden={isCreateCategoryModalOpened}
            >
                <CreateTaskForm categories={categories}
                                onCreateCategoryClick={() => {
                                    openCreateCategoryModal()
                                }}
                                onSubmit={async (formValues) => {
                                    createCurrentTask(
                                        formValues.name,
                                        formValues.categoryId,
                                        (formValues.hours * 3600) + (formValues.minutes * 60) + formValues.seconds
                                    )

                                    closeCreateTaskModal()
                                }}/>
            </Modal>


            <Modal title={"Create new category"}
                   centered
                   overlayProps={{opacity: 0}}
                   opened={isCreateCategoryModalOpened}
                   onClose={closeCategoryTaskModal}>
                <CreateCategoryForm onSubmit={(formValues) => {
                    createCategory(
                        formValues.name,
                        formValues.color
                    )
                    closeCategoryTaskModal()

                    openCreateTaskModal()
                }}/>
            </Modal>

            <FadeTransition trigger={!currentTask}>
                <Center>
                    <Button onClick={openCreateTaskModal} leftIcon={<IconSparkles/>}
                            variant={"subtle"} w={"50%"}>
                        Create new task
                    </Button>
                </Center>
            </FadeTransition>
        </>
    )
}