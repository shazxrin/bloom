import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import SessionTagsDeleteModal from "~/routes/session.tags/components/delete-modal"

type SessionTagsDeleteActionButtonProps = {
    tag: {
        id: string
        name: string
    }
}

export default function SessionTagsDeleteActionButton({ tag }: SessionTagsDeleteActionButtonProps) {
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

            <SessionTagsDeleteModal tag={ tag } opened={ opened } close={ close }/>
        </>
    )
}
