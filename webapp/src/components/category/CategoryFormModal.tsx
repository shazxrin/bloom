import {isNotEmpty, useForm} from "@mantine/form"
import {Box, Button, ColorInput, TextInput} from "@mantine/core"
import {IconPencil, IconPlus} from "@tabler/icons-react"
import useCategoryStore from "../../stores/categoryStore.ts"
import {ContextModalProps} from "@mantine/modals"
import {ListCategoryDto} from "../../api/dto.ts"

interface CategoryFormSubmitButtonProps {
    mode: "create" | "update"
}

const CategoryFormSubmitButton = ({mode}: CategoryFormSubmitButtonProps) => {
    const color = {
        "create": "teal",
        "update": "yellow"
    }
    const icon = {
        "create": <IconPlus size={18}/>,
        "update": <IconPencil size={18}/>
    }

    return (
        <Button leftIcon={icon[mode]}
                color={color[mode]}
                fullWidth
                type={"submit"}
                mt={"xl"}>
            {mode[0].toUpperCase() + mode.slice(1)}
        </Button>
    )
}

interface CategoryManageModalProps {
    mode: "create" | "update"
    category?: ListCategoryDto | undefined
}

interface CategoryFormValues {
    name: string
    color: string
}

export default function CategoryFormModal({context, id, innerProps}: ContextModalProps<CategoryManageModalProps>) {
    const {createCategory, updateCategory} = useCategoryStore((state) => ({
        createCategory: state.createCategory,
        updateCategory: state.updateCategory
    }))

    const form = useForm<CategoryFormValues>({
        initialValues: {
            name: innerProps.category?.name ?? "",
            color: innerProps.category?.color ?? ""
        },
        validate: {
            name: isNotEmpty("Please enter a name"),
            color: isNotEmpty("Please select a color")
        }
    })

    return (
        <Box py={8}>
            <form onSubmit={form.onSubmit((values) => {
                switch (innerProps.mode) {
                    case "create":
                        createCategory(values.name, values.color)
                        break
                    case "update":
                        updateCategory(innerProps.category?.id ?? "", values.name, values.color)
                        break
                }

                context.closeModal(id)
            })}>
                <TextInput {...form.getInputProps("name")}
                           label={"Category Name"}
                           placeholder={"Enter name of category"}
                           withAsterisk
                           mb={"sm"}/>
                <ColorInput {...form.getInputProps("color")}
                            label={"Color"}
                            withAsterisk
                            mb={"xl"}/>
                <CategoryFormSubmitButton mode={innerProps.mode} />
            </form>
        </Box>
    )
}
