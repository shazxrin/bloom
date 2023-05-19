import {
    IconPlayerPlay,
    IconPlayerPause,
    IconPlayerStop,
    IconArrowRight,
} from "@tabler/icons-react";
import {
    Center,
    Group,
    Stack,
    Text,
    ActionIcon,
    useMantineTheme,
    Badge
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
import {modals} from "@mantine/modals";
import CreateTaskModal from "../components/timer/CreateTaskModal.tsx";
import TimerClock from "../components/timer/TimerClock.tsx";

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
    const theme = useMantineTheme();

    const loaderData = useLoaderData() as LoaderData;

    const fetcher = useFetcher();

    return (
        <Center w={"100%"} h={"100%"}>
            <Stack>

                <Center>
                    <Group align={"center"}>
                        {loaderData.currentTask &&
                            <>
                                <Badge>
                                    {loaderData.categories.find(value => value.id == loaderData.currentTask?.categoryId)?.name}
                                </Badge>
                                <IconArrowRight size={18}></IconArrowRight>
                            </>}
                        <Text color={theme.colors.gray[6]} size={"sm"}>
                            {loaderData.currentTask ? loaderData.currentTask.name : "No current task"}
                        </Text>
                    </Group>
                </Center>

                <TimerClock remainingDuration={loaderData.currentTask?.remainingDuration ?? 0}
                           lastStartTime={loaderData.currentTask?.lastStartTime ?? new Date()}
                           hasTask={loaderData.currentTask != null}
                           isPaused={loaderData.currentTask?.isPaused ?? false}/>

                <Group position={"center"}>
                    <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                                disabled={loaderData.currentTask == null || loaderData.currentTask.isPaused}
                                onClick={() => fetcher.submit({
                                    action: "taskPause"
                                }, {
                                    method: "post",
                                    action: "/timer"
                                })}>
                        <IconPlayerPause color={theme.colors.yellow[7]}/>
                    </ActionIcon>
                    <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                                disabled={loaderData.currentTask == null ? false : !loaderData.currentTask.isPaused}
                                onClick={() => {
                                    if (loaderData.currentTask == null) {
                                        modals.open({
                                            title: "Create new task",
                                            centered: true,
                                            children: <CreateTaskModal categories={loaderData.categories}/>
                                        })
                                    } else {
                                        fetcher.submit({
                                            action: "taskResume",
                                        }, {
                                            method: "post",
                                            action: "/timer"
                                        });
                                    }
                                }}>
                        <IconPlayerPlay color={theme.colors.green[7]}/>
                    </ActionIcon>
                    <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                                disabled={loaderData.currentTask == null}
                                onClick={() => fetcher.submit({
                                    action: "taskEnd"
                                }, {
                                    method: "post",
                                    action: "/timer"
                                })}>
                        <IconPlayerStop color={theme.colors.red[7]}/>
                    </ActionIcon>
                </Group>
            </Stack>
        </Center>
    );
}