import { Button, Group, Modal, Text } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/tags"

type TagsDeleteModalProps = {
    tag: {
        id: string
        name: string
    }
    opened: boolean
    close: () => void
}

const TagsDeleteModal = ({ tag, opened, close }: TagsDeleteModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title="Confirm delete tag?" centered>
            <Text mb={ 16 }>
                Are you sure you want to delete '{ tag.name }'?
                This will delete all associated sessions!
            </Text>
            <Form method="DELETE" action={ "/tags" }>
                <input type={ "hidden" } name={ "id" } value={ tag.id }/>
                <Group justify="end">
                    <Button type="submit" color="red" loading={ navigation.state === "submitting" }>
                        Delete
                    </Button>
                    <Button onClick={ close } variant="outline">
                        Cancel
                    </Button>
                </Group>
            </Form>
        </Modal>
    )
}

export default TagsDeleteModal
