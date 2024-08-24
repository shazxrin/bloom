import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEdit } from "@tabler/icons-react"
import SessionTagsEditModal from "~/components/session/tags/edit-modal"

type SessionTagsEditActionButtonProps = {
    tag: {
        id: string
        name: string
        color: string
    }
}

const SessionTagsEditActionButton = ({ tag }: SessionTagsEditActionButtonProps) => {
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

            <SessionTagsEditModal tag={ tag } opened={ opened } close={ close }/>
        </>
    )
}

export default SessionTagsEditActionButton
