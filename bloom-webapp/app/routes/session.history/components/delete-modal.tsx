import { Button, Group, Modal, Text } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { ActionData } from "~/routes/session.history/action.server"
import { useEffect } from "react"

type SessionHistoryDeleteModalProps = {
    session: {
        id: string
        name: string
    }
    opened: boolean
    close: () => void
}

export default function SessionHistoryDeleteModal({ session, opened, close }: SessionHistoryDeleteModalProps) {
    const actionData = useActionData<ActionData>()
    useEffect(() => {
        // Close modal if session is deleted successfully
        if (actionData && actionData.action === "delete" && actionData.success) {
            close()
        }
    }, [actionData]);

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title={ "Confirm delete tag?" } centered={ true }>
            <Text mb={ 16 }>Are you sure you want to delete '{ session.name }'?</Text>
            <Form method={ "DELETE" } action={ "/session/history" }>
                <input type={ "hidden" } name={ "id" } value={ session.id }/>
                <Group justify={ "end" }>
                    <Button type={ "submit" } color={ "red" } loading={ navigation.state === "submitting" }>
                        Delete
                    </Button>
                    <Button onClick={ close } variant={ "outline" } disabled={ navigation.state === "submitting" }>
                        Cancel
                    </Button>
                </Group>
            </Form>
        </Modal>
    )
}
