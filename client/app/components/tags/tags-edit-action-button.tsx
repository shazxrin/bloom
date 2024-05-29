import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEdit } from "@tabler/icons-react"
import TagsEditModal from "~/components/tags/tags-edit-modal"

type TagsEditActionButtonProps = {
    tag: {
        id: string
        name: string
        color: string
    }
}

const TagsEditActionButton = ({ tag }: TagsEditActionButtonProps) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <ActionIcon
                variant="outline"
                color="blue"
                onClick={ open }
            >
                <IconEdit size={ 18 }/>
            </ActionIcon>

            <TagsEditModal tag={ tag } opened={ opened } close={ close }/>
        </>
    )
}

export default TagsEditActionButton
