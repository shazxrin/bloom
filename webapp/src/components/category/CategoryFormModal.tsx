import {isNotEmpty, useForm} from "@mantine/form"
import {Box, Button, ColorInput, TextInput} from "@mantine/core"
import {IconSparkles} from "@tabler/icons-react"
import useCategoryStore from "../../stores/categoryStore.ts"
import {ContextModalProps} from "@mantine/modals"

interface CategoryFormValues {
    name: string
    color: string
}

export default function CategoryFormModal({context, id}: ContextModalProps) {
    const {createCategory} = useCategoryStore((state) => ({
       createCategory: state.createCategory
    }))

    const form = useForm<CategoryFormValues>({
        initialValues: {
            name: "",
            color: ""
        },
        validate: {
            name: isNotEmpty("Please enter a name"),
            color: isNotEmpty("Please select a color")
        }
    })

    return (
        <Box py={8}>
            <form onSubmit={form.onSubmit((values) => {
                createCategory(values.name, values.color)

                context.closeModal(id)
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
        </Box>
    )
}
