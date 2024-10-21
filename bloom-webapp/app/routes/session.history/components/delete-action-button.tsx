import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import SessionsDeleteModal from "~/routes/session.history/components/delete-modal"

type SessionHistoryDeleteActionButtonProps = {
    session: {
        id: string
        name: string
        endDateTime?: string | undefined
    }
}

export default function SessionHistoryDeleteActionButton({ session }: SessionHistoryDeleteActionButtonProps) {
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
