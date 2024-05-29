import { Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"
import TagsCreateModal from "~/components/tags/tags-create-modal"

const TagsCreateButton = () => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Button
                leftSection={ <IconPlus size={ 20 }/> }
                onClick={ open }
            >
                Create Tag
            </Button>

            <TagsCreateModal opened={ opened } close={ close }/>
        </>
    )
}

export default TagsCreateButton
