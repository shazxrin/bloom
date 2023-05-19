import React, {forwardRef} from "react";
import {Button, ColorSwatch, Group, NumberInput, Select, Stack, Text, TextInput} from "@mantine/core";
import {isNotEmpty, useForm} from "@mantine/form";
import {IconPlayerPlay, IconSparkles} from "@tabler/icons-react";

interface CategorySelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    color: string;
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
);

interface CreateTaskFormValues {
    name: string;
    hours: number;
    minutes: number;
    seconds: number;
    categoryId: string;
}

interface CreateTaskFormProps {
    categories: { id: string, name: string, color: string }[];
    onSubmit: (formValues: CreateTaskFormValues) => void;
    onCreateCategoryClick: () => void;
}

export default function CreateTaskForm({categories, onSubmit, onCreateCategoryClick}: CreateTaskFormProps) {
    const form = useForm<CreateTaskFormValues>({
        initialValues: {
            name: "",
            hours: 0,
            minutes: 0,
            seconds: 0,
            categoryId: ""
        },
        validate: {
            name: isNotEmpty("Please enter a task name"),
            categoryId: isNotEmpty("Please select a category")
        }
    });

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput {...form.getInputProps("name")}
                       label={"Task Name"}
                       placeholder={"Enter name of task"}
                       withAsterisk mb={"sm"}/>
            <Group grow mb={"sm"}>
                <NumberInput {...form.getInputProps("hours")}
                             label={"Hours"}
                             withAsterisk
                             hideControls/>
                <NumberInput {...form.getInputProps("minutes")}
                             label={"Minutes"}
                             withAsterisk
                             hideControls/>
                <NumberInput {...form.getInputProps("seconds")}
                             label={"Seconds"}
                             withAsterisk
                             hideControls/>
            </Group>
            <Stack>
                <Select
                    {...form.getInputProps("categoryId")}
                    label="Category"
                    placeholder="Select a category"
                    itemComponent={CategorySelectItem}
                    data={categories.map(c => ({value: c.id, label: c.name, color: c.color}))}
                    withAsterisk
                    onChange={value => form.setFieldValue("categoryId", value ?? "")}
                />
                <Button leftIcon={<IconSparkles size={18}/>} variant={"light"} onClick={onCreateCategoryClick}>
                    Create new category
                </Button>
            </Stack>
            <Button leftIcon={<IconPlayerPlay size={18} />} color={"teal"} fullWidth type={"submit"} mt={"xl"}>
                Start
            </Button>
        </form>
    );
}
