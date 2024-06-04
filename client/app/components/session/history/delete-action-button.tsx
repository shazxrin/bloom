import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import SessionsDeleteModal from "~/components/session/history/delete-modal"

type SessionHistoryDeleteActionButtonProps = {
    session: {
        id: string
        name: string
        endDateTime?: string | undefined
    }
}

const SessionHistoryDeleteActionButton = ({ session }: SessionHistoryDeleteActionButtonProps) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <ActionIcon
                variant={ "outline" }
                color={ "red" }
                onClick={ open }
                disabled={ !session.endDateTime }
            >
                <IconTrash size={ 18 }/>
            </ActionIcon>

            <SessionsDeleteModal session={ session } opened={ opened } close={ close }/>
        </>
    )
}

export default SessionHistoryDeleteActionButton
