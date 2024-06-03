import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import SessionTagsDeleteModal from "~/components/session/tags/delete-modal"

type SessionTagsDeleteActionButtonProps = {
    tag: {
        id: string
        name: string
    }
}

const SessionTagsDeleteActionButton = ({ tag }: SessionTagsDeleteActionButtonProps) => {
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
export default SessionTagsDeleteActionButton
