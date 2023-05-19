import {isNotEmpty, useForm} from "@mantine/form";
import {useFetcher} from "react-router-dom";
import {Button, ColorInput, TextInput} from "@mantine/core";
import {IconSparkles} from "@tabler/icons-react";
import {modals} from "@mantine/modals";

interface CreateCategoryForm {
    name: string;
    color: string;
}

export default function CreateCategoryModal() {
    const fetcher = useFetcher();

    const form = useForm<CreateCategoryForm>({
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
        <form onSubmit={form.onSubmit((formValues) => {
            fetcher.submit({
                action: "categoryCreate",
                name: formValues.name,
                color: formValues.color
            }, {
                method: "post",
                action: "/timer"
            });
        })}>
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