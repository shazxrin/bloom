import {
    Center,
    Modal, Overlay,
    Stack,
} from "@mantine/core";
import {ActionFunction, LoaderFunction, useFetcher, useLoaderData} from "react-router-dom"
import {
    apiGetAllCategory,
    apiGetCurrentTask, apiPostCreateCategory,
    apiPostCreateTask,
    apiPostEndTask,
    apiPostPauseTask,
    apiPostResumeTask
} from "../api.ts";
import TimerClock from "../components/timer/TimerClock.tsx";
import TimerButtons from "../components/timer/TimerButtons.tsx";
import TimerLabel from "../components/timer/TimerLabel.tsx";
import {useDisclosure} from "@mantine/hooks";
import CreateCategoryForm from "../components/category/CreateCategoryForm.tsx";
import CreateTaskForm from "../components/task/CreateTaskForm.tsx";

interface LoaderData {
    currentTask: {
        name: string;
        categoryId: string;
        duration: number;
        remainingDuration: number;
        isPaused: boolean;
        startTime: Date;
        lastStartTime: Date;
    } | null;
    categories: {
        id: string;
        name: string;
        color: string;
    }[]
}

export const timerLoader: LoaderFunction = async (): Promise<LoaderData> => {
    const {data: apiCurrentTask, status: apiCurrentTaskStatus} = await apiGetCurrentTask()
    const {data: apiAllCategory} = await apiGetAllCategory()

    return {
        currentTask: apiCurrentTaskStatus == 204 ? null : {
            name: apiCurrentTask.name,
            categoryId: apiCurrentTask.categoryId,
            duration: apiCurrentTask.duration,
            remainingDuration: apiCurrentTask.remainingDuration,
            isPaused: apiCurrentTask.isPaused,
            startTime: new Date(apiCurrentTask.startTime),
            lastStartTime: new Date(apiCurrentTask.lastStartTime)
        },
        categories: apiAllCategory
    };
}

export const timerAction: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const action = formData.get("action")?.toString() ?? "";

    if (action === "taskPause") {
        await apiPostPauseTask();
    } else if (action === "taskResume") {
        await apiPostResumeTask();
    } else if (action === "taskEnd") {
        await apiPostEndTask();
    } else if (action === "taskCreate") {
        const name = formData.get("name")?.toString() ?? "";
        const categoryId = formData.get("categoryId")?.toString() ?? "";
        const duration = parseInt(formData.get("duration")?.toString() ?? "0");

        await apiPostCreateTask({
            name: name,
            categoryId: categoryId,
            duration: duration
        });
    } else if (action === "categoryCreate") {
        const name = formData.get("name")?.toString() ?? "";
        const color = formData.get("color")?.toString() ?? "";

        await apiPostCreateCategory({
            name: name,
            color: color
        });
    }

    return null;
}

export default function Timer() {
    const loaderData = useLoaderData() as LoaderData;

    const fetcher = useFetcher();

    const [createTaskModalOpened, {
        open: openCreateTaskModal,
        close: closeCreateTaskModal
    }] = useDisclosure(false);
    const [createCategoryModalOpened, {
        open: openCreateCategoryModal,
        close: closeCategoryTaskModal
    }] = useDisclosure(false);

    return (
        <Center w={"100%"} h={"100%"}>
            <Overlay hidden={!createTaskModalOpened} />

            <Modal title={"Create new task"}
                   centered
                   overlayProps={{opacity: 0}}
                   opened={createTaskModalOpened}
                   onClose={closeCreateTaskModal}
                   hidden={createCategoryModalOpened}>
                <CreateTaskForm categories={loaderData.categories}
                                onCreateCategoryClick={() => {
                                    openCreateCategoryModal();
                                }}
                                onSubmit={(formValues) => {
                                    fetcher.submit({
                                        action: "taskCreate",
                                        name: formValues.name,
                                        categoryId: formValues.categoryId,
                                        duration: ((formValues.hours * 3600) + (formValues.minutes * 60) + formValues.seconds).toString()
                                    }, {method: "post"});

                                    closeCreateTaskModal();
                                }}/>
            </Modal>

            <Modal title={"Create new category"}
                   centered
                   overlayProps={{opacity: 0}}
                   opened={createCategoryModalOpened}
                   onClose={closeCategoryTaskModal}>
                <CreateCategoryForm onSubmit={(formValues) => {
                    fetcher.submit({
                        action: "categoryCreate",
                        name: formValues.name,
                        color: formValues.color
                    }, {method: "post"});
                    closeCategoryTaskModal();

                    openCreateTaskModal();
                }}/>
            </Modal>

            <Stack>
                <TimerLabel hasTask={loaderData.currentTask != null}
                            taskName={loaderData.currentTask?.name ?? ""}
                            categoryName={loaderData.categories.find(value => value.id === (loaderData.currentTask?.categoryId ?? ""))?.name ?? ""}
                            categoryColor={loaderData.categories.find(value => value.id === (loaderData.currentTask?.categoryId ?? ""))?.color ?? ""}/>

                <TimerClock remainingDuration={loaderData.currentTask?.remainingDuration ?? 0}
                            lastStartTime={loaderData.currentTask?.lastStartTime ?? new Date()}
                            hasTask={loaderData.currentTask != null}
                            isPaused={loaderData.currentTask?.isPaused ?? false}/>

                <TimerButtons hasTask={loaderData.currentTask != null}
                              isPaused={loaderData.currentTask?.isPaused ?? false}
                              onPauseButtonClick={() => fetcher.submit({action: "taskPause"}, {method: "post"})}
                              onPlayButtonClick={() => loaderData.currentTask == null ? openCreateTaskModal() : fetcher.submit({action: "taskResume"}, {method: "post"})}
                              onStopButtonClick={() => fetcher.submit({action: "taskEnd"}, {method: "post"})}/>
            </Stack>
        </Center>
    );
}