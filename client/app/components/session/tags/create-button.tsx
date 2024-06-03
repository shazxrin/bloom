import { Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"
import SessionTagsCreateModal from "~/components/session/tags/create-modal"

const SessionTagsCreateButton = () => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Button
                leftSection={ <IconPlus size={ 20 }/> }
                onClick={ open }
            >
                Create Tag
            </Button>

            <SessionTagsCreateModal opened={ opened } close={ close }/>
        </>
    )
}

export default SessionTagsCreateButton
