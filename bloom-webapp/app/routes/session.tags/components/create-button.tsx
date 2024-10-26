import { Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"
import SessionTagsCreateModal from "~/routes/session.tags/components/create-modal"

export default function SessionTagsCreateButton() {
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
