import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import TagsDeleteModal from "~/components/tags/tags-delete-modal"

type TagsDeleteActionButtonProps = {
    tag: {
        id: string
        name: string
    }
}

const TagsDeleteActionButton = ({ tag }: TagsDeleteActionButtonProps) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <ActionIcon
                variant="outline"
                color="red"
                onClick={ open }
            >
                <IconTrash size={ 18 }/>
            </ActionIcon>

            <TagsDeleteModal tag={ tag } opened={ opened } close={ close }/>
        </>
    )
}
export default TagsDeleteActionButton
