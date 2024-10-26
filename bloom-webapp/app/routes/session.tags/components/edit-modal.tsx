import { Button, ColorInput, Modal, Stack, TextInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { ActionData } from "~/routes/session.tags/action.server";

type SessionTagsEditModalProps = {
    tag: {
        id: string
        name: string
        color: string
    }
    opened: boolean
    close: () => void
}

export default function SessionTagsEditModal({ tag, opened, close }: SessionTagsEditModalProps) {
    const actionData = useActionData<ActionData>()
    useEffect(() => {
        // Close modal if tag is updated successfully
        if (actionData && actionData.action === "update" && actionData.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title="Edit Tag" centered>
            <Form method="PUT" action={ "/session/tags" }>
                <input type={ "hidden" } name={ "id" } value={ tag.id }/>
                <Stack gap={ 16 }>
                    <TextInput
                        label="Name"
                        placeholder="Enter Name"
                        name="name"
                        defaultValue={ tag.name }
                        required
                        error={ !actionData?.success && (actionData?.errors["name"]?.join(", ") ?? "") }
                    />

                    <ColorInput
                        label="Color"
                        placeholder="Enter Color"
                        name="color"
                        defaultValue={ tag.color }
                        required
                        error={ !actionData?.success && (actionData?.errors["color"]?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Update
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}
