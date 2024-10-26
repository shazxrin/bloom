import { Modal, Stack, TextInput, Button, ColorInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { ActionData } from "~/routes/session.tags/action.server";

type SessionTagsCreateModalProps = {
    opened: boolean
    close: () => void
}

export default function SessionTagsCreateModal({ opened, close }: SessionTagsCreateModalProps) {
    const actionData = useActionData<ActionData>()
    const navigation = useNavigation()

    useEffect(() => {
        // Close modal if tag is created successfully
        if (actionData && actionData.action === "create" && actionData.success) {
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
                        error={ !actionData?.success && (actionData?.errors["name"]?.join(", ") ?? "") }
                    />

                    <ColorInput
                        label="Color"
                        placeholder="Enter Color"
                        name="color"
                        required
                        error={ !actionData?.success && (actionData?.errors["color"]?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Create
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}
