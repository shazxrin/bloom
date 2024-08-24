import { Modal, Stack, TextInput, Button, ColorInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { action } from "~/routes/session.tags"

type SessionTagsCreateModalProps = {
    opened: boolean
    close: () => void
}

const SessionTagsCreateModal = ({ opened, close }: SessionTagsCreateModalProps) => {
    const actionData = useActionData<typeof action>()
    const navigation = useNavigation()

    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    return (
        <Modal opened={ opened } onClose={ close } title="New Tag" centered>
            <Form method="POST" action="/session/tags">
                <Stack gap={ 16 }>
                    <TextInput
                        label="Name"
                        placeholder="Enter Name"
                        name="name"
                        required
                        error={ !actionData?.success && (actionData?.errors?.get("name")?.join(", ") ?? "") }
                    />

                    <ColorInput
                        label="Color"
                        placeholder="Enter Color"
                        name="color"
                        required
                        error={ !actionData?.success && (actionData?.errors?.get("color")?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Create
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default SessionTagsCreateModal
