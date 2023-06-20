import {isNotEmpty, useForm} from "@mantine/form";
import {Button, ColorInput, TextInput} from "@mantine/core";
import {IconSparkles} from "@tabler/icons-react";

interface CreateCategoryFormValues {
    name: string;
    color: string;
}

interface CreateCategoryFormProps {
    onSubmit: (formValues: CreateCategoryFormValues) => void;
}

export default function CreateCategoryForm({onSubmit}: CreateCategoryFormProps) {
    const form = useForm<CreateCategoryFormValues>({
        initialValues: {
            name: "",
            color: ""
        },
        validate: {
            name: isNotEmpty("Please enter a name"),
            color: isNotEmpty("Please select a color")
        }
    });

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput {...form.getInputProps("name")}
                       label={"Category Name"}
                       placeholder={"Enter name of categoty"}
                       withAsterisk
                       mb={"sm"}/>
            <ColorInput {...form.getInputProps("color")}
                        label={"Color"}
                        withAsterisk
                        mb={"xl"}/>
            <Button leftIcon={<IconSparkles size={18}/>} fullWidth type={"submit"}>
                Create
            </Button>
        </form>
    );
}
