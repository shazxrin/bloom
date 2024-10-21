import { ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEdit } from "@tabler/icons-react"
import SessionsEditModal from "~/routes/session.history/components/edit-modal"

type SessionHistoryEditActionButtonProps = {
    session: {
        id: string
        name: string,
        totalDuration: number,
        tag: {
            id: string,
            name: string,
            color: string
        },
        startDateTime: string
        endDateTime?: string | undefined
    }
    tags: {
        id: string
        name: string
        color: string
    }[]
}

export default function SessionHistoryEditActionButton({ session, tags }: SessionHistoryEditActionButtonProps) {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <ActionIcon
                variant={ "outline" }
                color={ "blue" }
                onClick={ open }
                disabled={ !session.endDateTime }
            >
                <IconEdit size={ 18 }/>
            </ActionIcon>

            <SessionsEditModal session={ session } tags={ tags } opened={ opened } close={ close }/>
        </>
    )
}
