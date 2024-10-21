import { Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"
import SessionHistoryCreateModal from "~/routes/session.history/components/create-modal"

type SessionHistoryCreateButtonProps = {
    tags: {
        id: string
        name: string
        color: string
    }[]
}

export default function SessionHistoryCreateButton({ tags }: SessionHistoryCreateButtonProps){
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Button
                leftSection={ <IconPlus size={ 20 }/> }
                onClick={ open }
            >
                Add Session
            </Button>

            <SessionHistoryCreateModal opened={ opened } close={ close } tags={ tags }/>
        </>
    )
}
