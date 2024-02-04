import {ActionIcon, Button, ColorSwatch, Group, Stack, Text} from "@mantine/core"
import useCategoryStore from "../../stores/categoryStore.ts"
import {IconPencil, IconSparkles, IconTrash} from "@tabler/icons-react"
import {modals} from "@mantine/modals"

export default function CategoryManageModal() {
    const {categories, deleteCategory} = useCategoryStore((state) => ({
        categories: state.categories,
        deleteCategory: state.deleteCategory
    }))

    return (
        <Stack py={8}>
            {
                categories.map(category => (
                    <Group key={category.id} position={"apart"}>
                        <Group>
                            <ColorSwatch color={category.color}/>
                            <Text maw={150} truncate={"end"}>{category.name}</Text>
                        </Group>
                        <Group>
                            <Group spacing={"xs"}>
                                <ActionIcon
                                    size={"lg"}
                                    color={"orange"}
                                    variant={"light"}
                                    onClick={() => modals.openContextModal({
                                        modal: "categoryFormModal",
                                        title: <Text size={"lg"}>Edit Category</Text>,
                                        innerProps: {
                                            mode: "update",
                                            category: category
                                        }
                                    })}>
                                    <IconPencil size={18}/>
                                </ActionIcon>

                                <ActionIcon
                                    size={"lg"}
                                    color={"red"}
                                    variant={"light"}
                                    onClick={() => deleteCategory(category.id)}>
                                    <IconTrash size={18}/>
                                </ActionIcon>
                            </Group>
                        </Group>
                    </Group>
                ))
            }

            <Button
                mt={8}
                leftIcon={<IconSparkles size={18}/>}
                variant={"light"}
                color={"green"}
                onClick={() => modals.openContextModal({
                    modal: "categoryFormModal",
                    title: <Text size={"lg"}>Create Category</Text>,
                    innerProps: {
                        mode: "create"
                    }
                })}>
                Create new category
            </Button>
        </Stack>
    )
}
