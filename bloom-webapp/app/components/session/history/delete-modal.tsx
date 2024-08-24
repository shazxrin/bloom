import { Button, Group, Modal, Text } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/session.history"

type SessionHistoryDeleteModalProps = {
    session: {
        id: string
        name: string
    }
    opened: boolean
    close: () => void
}

const SessionHistoryDeleteModal = ({ session, opened, close }: SessionHistoryDeleteModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

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

export default SessionHistoryDeleteModal
