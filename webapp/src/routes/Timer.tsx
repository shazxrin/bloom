import {
    Center,
    Modal,
    Overlay,
    Stack,
} from "@mantine/core";
import {ActionFunction, LoaderFunction, useFetcher, useLoaderData} from "react-router-dom"
import TimerClock from "../components/timer/TimerClock.tsx";
import TimerButtons from "../components/timer/TimerButtons.tsx";
import TimerLabel from "../components/timer/TimerLabel.tsx";
import {useDisclosure} from "@mantine/hooks";
import CreateCategoryForm from "../components/category/CreateCategoryForm.tsx";
import CreateTaskForm from "../components/task/CreateTaskForm.tsx";
import {CategoryControllerApi, TaskControllerApi} from "../api";

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
    const taskApi = new TaskControllerApi();
    const apiCurrentTaskResponse = await taskApi.getCurrentTask();

    const categoryApi = new CategoryControllerApi();
    const apiAllCategoriesResponse = await categoryApi.getAllCategories();

    return {
        currentTask: apiCurrentTaskResponse.status == 204 ? null : {
            name: apiCurrentTaskResponse.data.name,
            categoryId: apiCurrentTaskResponse.data.categoryId,
            duration: apiCurrentTaskResponse.data.duration,
            remainingDuration: apiCurrentTaskResponse.data.remainingDuration,
            isPaused: apiCurrentTaskResponse.data.isPaused,
            startTime: new Date(apiCurrentTaskResponse.data.startTime),
            lastStartTime: new Date(apiCurrentTaskResponse.data.lastStartTime)
        },
        categories: apiAllCategoriesResponse.data
    };
}

export const timerAction: ActionFunction = async ({request}) => {
    const taskApi = new TaskControllerApi();
    const categoryApi = new CategoryControllerApi();

    const formData = await request.formData();
    const action = formData.get("action")?.toString() ?? "";

    if (action === "taskPause") {
        await taskApi.postPauseCurrentTask();
    } else if (action === "taskResume") {
        await taskApi.postResumeCurrentTask();
    } else if (action === "taskEnd") {
        await taskApi.postEndCurrentTask();
    } else if (action === "taskCreate") {
        const name = formData.get("name")?.toString() ?? "";
        const categoryId = formData.get("categoryId")?.toString() ?? "";
        const duration = parseInt(formData.get("duration")?.toString() ?? "0");

        await taskApi.postCreateCurrentTask({
            createCurrentTaskDto: {
                name: name,
                categoryId: categoryId,
                duration: duration
            }
        });
    } else if (action === "categoryCreate") {
        const name = formData.get("name")?.toString() ?? "";
        const color = formData.get("color")?.toString() ?? "";

        await categoryApi.postCreateCategory({
            createCategoryDto: {
                name: name,
                color: color
            }
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