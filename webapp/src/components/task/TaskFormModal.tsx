import React, {forwardRef} from "react"
import {
    Box,
    Button,
    ColorSwatch,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput
} from "@mantine/core"
import {isInRange, isNotEmpty, useForm} from "@mantine/form"
import {IconList, IconPencil, IconPlayerPlay, IconPlus} from "@tabler/icons-react"
import {ListTaskDto} from "../../api/dto.ts"
import {ContextModalProps, modals} from "@mantine/modals"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"
import {DateTimePicker} from "@mantine/dates"
import {addHours, addMinutes, addSeconds, format} from "date-fns"
import useHistoryTaskStore from "../../stores/taskHistoryStore.ts"

interface CategorySelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string
    color: string
}

const CategorySelectItem = forwardRef<HTMLDivElement, CategorySelectItemProps>(
    ({label, color, ...others}: CategorySelectItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group>
                <ColorSwatch color={color}></ColorSwatch>
                <Text>{label}</Text>
            </Group>
        </div>
    )
)

interface TaskFormSubmitButtonProps {
    mode: "create" | "add" | "update"
}

const TaskFormSubmitButton = ({mode}: TaskFormSubmitButtonProps) => {
    const color = {
        "create": "teal",
        "add": "teal",
        "update": "yellow"
    }
    const icon = {
        "create": <IconPlayerPlay size={18}/>,
        "add": <IconPlus size={18}/>,
        "update": <IconPencil size={18}/>
    }

    return (
        <Button leftIcon={icon[mode]}
                color={color[mode]}
                fullWidth
                type={"submit"}
                mt={"xl"}>
            {mode[0].toUpperCase() + mode.substr(1)}
        </Button>
    )
}

interface TaskFormValues {
    name: string
    hours: number
    minutes: number
    seconds: number
    categoryId: string
    startTime: Date
    endTime: Date
}

interface TaskFormModalProps {
    mode: "create" | "add" | "update"
    task?: ListTaskDto | undefined
}

export default function TaskFormModal({context, id, innerProps}: ContextModalProps<TaskFormModalProps>) {
    const {createCurrentTask} = useCurrentTaskStore((state) => ({
        createCurrentTask: state.createCurrentTask,
    }))

    const {addTask, updateTask} = useHistoryTaskStore((state) => ({
        addTask: state.addTask,
        updateTask: state.updateTask
    }))

    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const duration = innerProps.task?.duration ?? 0
    const hours = Math.max(Math.floor(Math.abs(duration) / 3600), 0)
    const minutes = Math.max(Math.floor((Math.abs(duration) - (hours * 3600)) / 60), 0)
    const seconds = Math.max(Math.floor(Math.abs(duration) - (hours * 3600) - (minutes * 60)), 0)

    const form = useForm<TaskFormValues>({
        initialValues: {
            name: innerProps.task?.name ?? "",
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            categoryId: innerProps.task?.categoryId ?? "",
            startTime: innerProps.task?.startTime ? new Date(innerProps.task.startTime) : new Date(),
            endTime: innerProps.task?.endTime ? new Date(innerProps.task.endTime) : new Date()
        },
        validate: {
            name: isNotEmpty("Please enter a task name"),
            categoryId: isNotEmpty("Please select a category"),
            hours: isInRange({min: 0}, "Cannot be less than 0"),
            minutes: isInRange({min: 0}, "Cannot be less than 0"),
            seconds: isInRange({min: 0}, "Cannot be less than 0")
        }
    })

    return (
        <Box py={8}>
            <form onSubmit={form.onSubmit(values => {
                const duration = (values.hours * 3600) + (values.minutes * 60) + values.seconds

                switch (innerProps.mode) {
                    case "create":
                        createCurrentTask(values.name, values.categoryId, duration)
                        break
                    case "add":
                        addTask(
                            values.name,
                            values.categoryId,
                            duration,
                            format(values.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                            format(values.endTime, "yyyy-MM-dd'T'HH:mm:ss")
                        )
                        break
                    case "update":
                        updateTask(
                            innerProps.task?.id ?? "",
                            values.name,
                            values.categoryId,
                            duration,
                            format(values.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                            format(values.endTime, "yyyy-MM-dd'T'HH:mm:ss")
                        )
                        break
                }

                context.closeModal(id)
            })}>
                <Stack mb={"sm"}>
                    <Select
                        {...form.getInputProps("categoryId")}
                        label="Category"
                        placeholder="Select a category"
                        itemComponent={CategorySelectItem}
                        data={categories.map(c => ({value: c.id, label: c.name, color: c.color}))}
                        withAsterisk={true}
                        onChange={value => form.setFieldValue("categoryId", value ?? "")}
                    />
                    <Button leftIcon={<IconList size={18}/>}
                            variant={"outline"}
                            onClick={() => modals.openContextModal({
                                modal: "categoryManageModal",
                                title: <Text size={"lg"}>Manage categories</Text>,
                                innerProps: {}
                            })}>
                        Manage categories
                    </Button>
                </Stack>

                <TextInput {...form.getInputProps("name")}
                           label={"Task Name"}
                           placeholder={"Enter name of task"}
                           withAsterisk={true}
                           mb={"sm"}/>
                <Group grow mb={"sm"}>
                    <NumberInput {...form.getInputProps("hours")}
                                 onChange={(value) => {
                                     if (typeof value !== "string") {
                                        const newDate = addHours(form.values.startTime, value)
                                        form.setFieldValue("endTime", newDate)
                                     }
                                     form.getInputProps("hours").onChange(value)
                                 }}
                                 label={"Hours"}
                                 withAsterisk={true}
                                 max={23}/>
                    <NumberInput {...form.getInputProps("minutes")}
                                 onChange={(value) => {
                                     if (typeof value !== "string") {
                                         const newDate = addMinutes(form.values.startTime, value)
                                         form.setFieldValue("endTime", newDate)
                                     }
                                     form.getInputProps("minutes").onChange(value)
                                 }}
                                 label={"Minutes"}
                                 withAsterisk={true}
                                 max={59}/>
                    <NumberInput {...form.getInputProps("seconds")}
                                 onChange={(value) => {
                                     if (typeof value !== "string") {
                                         const newDate = addSeconds(form.values.startTime, value)
                                         form.setFieldValue("endTime", newDate)
                                     }
                                     form.getInputProps("seconds").onChange(value)
                                 }}
                                 label={"Seconds"}
                                 withAsterisk={true}
                                 max={59}/>
                </Group>

                <DateTimePicker {...form.getInputProps("startTime")}
                                onChange={(value) => {
                                    if (value !== null) {
                                        let newDate = addHours(value, form.values.hours)
                                        newDate = addMinutes(newDate, form.values.minutes)
                                        newDate = addSeconds(newDate, form.values.seconds)
                                        form.setFieldValue("endTime", newDate)

                                        form.getInputProps("startTime").onChange(value)
                                    }
                                }}
                                label={"Start Time"}
                                dropdownType="modal"
                                modalProps={{
                                    zIndex: 1000,
                                    centered: true
                                }}
                                mb={"sm"}
                                withAsterisk={true}
                                withSeconds={true}
                                maxDate={new Date()}
                                disabled={innerProps.mode === "create"}/>

                <DateTimePicker {...form.getInputProps("endTime")}
                                label={"End Time"}
                                dropdownType="modal"
                                modalProps={{
                                    zIndex: 1000,
                                    centered: true
                                }}
                                mb={"sm"}
                                withAsterisk={true}
                                withSeconds={true}
                                maxDate={new Date()}
                                disabled={innerProps.mode === "create"}/>
                <TaskFormSubmitButton mode={innerProps.mode}/>
            </form>
        </Box>
    )
}
