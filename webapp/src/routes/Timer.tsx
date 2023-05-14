import {IconPlayerPlay, IconPlayerPause, IconPlayerStop} from "@tabler/icons-react";
import {
    Center,
    Group,
    Stack,
    Text,
    ActionIcon,
    useMantineTheme,
    TextInput,
    NumberInput,
    Select,
    Button,
    Badge
} from "@mantine/core";
import {ActionFunction, LoaderFunction, useFetcher, useLoaderData} from "react-router-dom"
import {
    apiGetAllCategory,
    apiGetCurrentTask,
    apiPostCreateTask,
    apiPostEndTask,
    apiPostPauseTask,
    apiPostResumeTask
} from "../api.ts";
import {forwardRef, useEffect, useState} from "react";
import {differenceInSeconds} from "date-fns";
import {modals} from "@mantine/modals";

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
    const timerAction = formData.get("timerAction")?.toString();

    if (timerAction === "pause") {
        await apiPostPauseTask();
    } else if (timerAction === "resume") {
        await apiPostResumeTask();
    } else if (timerAction === "end") {
        await apiPostEndTask();
    } else if (timerAction === "create") {
        const name = formData.get("name")?.toString() ?? "";
        const categoryId = formData.get("categoryId")?.toString() ?? "";
        const duration = parseInt(formData.get("duration")?.toString() ?? "0");

        await apiPostCreateTask({
            name: name,
            categoryId: categoryId,
            duration: duration
        });
    }

    return null;
}

interface CategorySelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    color: string;
}

const CategorySelectItem = forwardRef<HTMLDivElement, CategorySelectItemProps>(
    ({label, color, ...others}: CategorySelectItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group>
                <Badge color={color}></Badge>
                <Text>{label}</Text>
            </Group>
        </div>
    )
);

interface CreateTaskModalProps {
    categories: { id: string, name: string, color: string }[];
}

function CreateTaskModal({categories}: CreateTaskModalProps) {
    const fetcher = useFetcher();

    const [name, setName] = useState<string | null>(null);
    const [hours, setHours] = useState<number | "">(1);
    const [minutes, setMinutes] = useState<number | "">(0);
    const [seconds, setSeconds] = useState<number | "">(0);
    const [categoryId, setCategoryId] = useState<string | null>(null);

    return (
        <>
            <TextInput label={"Task Name"} withAsterisk mb={"sm"}
                       onChange={event => setName(event.currentTarget.value)}/>
            <Group grow mb={"sm"}>
                <NumberInput label={"Hours"} defaultValue={1} withAsterisk hideControls
                             onChange={value => setHours(value)}/>
                <NumberInput label={"Minutes"} defaultValue={0} withAsterisk hideControls
                             onChange={value => setMinutes(value)}/>
                <NumberInput label={"Seconds"} defaultValue={0} withAsterisk hideControls
                             onChange={value => setSeconds(value)}/>
            </Group>
            <Select
                label="Category"
                placeholder="Pick category"
                itemComponent={CategorySelectItem}
                data={categories.map(c => ({value: c.id, label: c.name, color: c.color}))}
                withAsterisk
                mb={"xl"}
                onChange={value => setCategoryId(value)}
            />
            <Button color={"teal"} fullWidth onClick={() => {
                if (name === null) {
                    return;
                }
                if (categoryId === null) {
                    return;
                }
                if (hours === "") {
                    return;
                }
                if (minutes === "") {
                    return;
                }
                if (seconds === "") {
                    return;
                }

                fetcher.submit({
                    timerAction: "create",
                    name: name,
                    categoryId: categoryId,
                    duration: ((hours * 3600) + (minutes * 60) + seconds).toString(),
                }, {
                    method: "post",
                    action: "/timer"
                });

                modals.closeAll();
            }}>
                Start
            </Button>
        </>
    );
}

interface TimerTextProps {
    remainingDuration: number;
    lastStartTime: Date;
    isPaused: boolean;
    hasTask: boolean;
}

function TimerText({remainingDuration, lastStartTime, isPaused, hasTask}: TimerTextProps) {
    const [leftDuration, setLeftDuration] = useState(remainingDuration);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (hasTask && !isPaused) {
            const timer = setInterval(() => {
                setLeftDuration(remainingDuration - differenceInSeconds(new Date(), lastStartTime));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingDuration, lastStartTime, hasTask, isPaused]);

    useEffect(() => {
        setLeftDuration(remainingDuration);
    }, [remainingDuration]);

    useEffect(() => {
        const hours = Math.max(Math.floor(Math.abs(leftDuration) / 3600), 0);
        const minutes = Math.max(Math.floor((Math.abs(leftDuration) - (hours * 3600)) / 60), 0);
        const seconds = Math.max(Math.floor(Math.abs(leftDuration) - (hours * 3600) - (minutes * 60)), 0);

        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
    }, [leftDuration]);

    const theme = useMantineTheme();
    const pausedColor = theme.colors.yellow[8];
    const neutralColor = theme.colors.gray[8];
    const ongoingColor = theme.colors.green[8];
    const doneColor = theme.colors.blue[8];
    const [timerColor, setTimerColor] = useState(neutralColor);
    useEffect(() => {
        if (hasTask) {
            if (isPaused)  {
                setTimerColor(pausedColor)
            } else {
                if (leftDuration > 0) {
                    setTimerColor(ongoingColor);
                } else {
                    setTimerColor(doneColor)
                }
            }
        } else {
            setTimerColor(neutralColor);
        }
    }, [hasTask, isPaused, leftDuration])

    return (
        <Group spacing={"xl"}>
            <Text size={"5rem"} weight={"bold"} color={timerColor} ff={"monospace"}>
                {String(hours).padStart(2, "0")}
            </Text>
            <Text size={"5rem"} weight={"bold"} color={timerColor} ff={"monospace"}>
                {String(minutes).padStart(2, "0")}
            </Text>
            <Text size={"5rem"} weight={"bold"} color={timerColor} ff={"monospace"}>
                {String(seconds).padStart(2, "0")}
            </Text>
        </Group>
    );
}

export default function Timer() {
    const theme = useMantineTheme();

    const loaderData = useLoaderData() as LoaderData;

    const fetcher = useFetcher();

    return (
        <Center w={"100%"} h={"100%"}>
            <Stack>
                <Center>
                    <Text color={theme.colors.gray[6]} italic>
                        {loaderData.currentTask ? loaderData.currentTask.name : "No current task"}
                    </Text>
                </Center>

                <TimerText remainingDuration={loaderData.currentTask?.remainingDuration ?? 0}
                           lastStartTime={loaderData.currentTask?.lastStartTime ?? new Date()}
                           hasTask={loaderData.currentTask != null}
                           isPaused={loaderData.currentTask?.isPaused ?? false}/>

                <Group position={"center"}>
                    <ActionIcon size={"xl"} variant={"default"} radius={"xl"}
                                disabled={loaderData.currentTask == null || loaderData.currentTask.isPaused}
                                onClick={() => fetcher.submit({
                                    timerAction: "pause"
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
                                            children: <CreateTaskModal categories={loaderData.categories}/>
                                        })
                                    } else {
                                        fetcher.submit({
                                            timerAction: "resume",
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
                                    timerAction: "end"
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