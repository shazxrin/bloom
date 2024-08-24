import { Button, Group, Modal, Text } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { action } from "~/routes/session.tags"

type SessionTagsDeleteModalProps = {
    tag: {
        id: string
        name: string
    }
    opened: boolean
    close: () => void
}

const SessionTagsDeleteModal = ({ tag, opened, close }: SessionTagsDeleteModalProps) => {
    const actionData = useActionData<typeof action>()
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
            <Form method="DELETE" action={ "/session/tags" }>
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

export default SessionTagsDeleteModal
