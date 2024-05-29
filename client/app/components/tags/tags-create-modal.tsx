import { Modal, Stack, TextInput, Button, ColorInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/tags"

type TagsCreateModalProps = {
    opened: boolean
    close: () => void
}

const TagsCreateModal = ({ opened, close }: TagsCreateModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    const navigation = useNavigation()

    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    return (
        <Modal opened={ opened } onClose={ close } title="New Tag" centered>
            <Form method="POST" action="/tags">
                <Stack gap={ 16 }>
                    <TextInput
                        label="Name"
                        placeholder="Enter Name"
                        name="name"
                        required
                        error={ !actionData?.success && (actionData?.errors?.name?.join(", ") ?? "") }
                    />

                    <ColorInput
                        label="Color"
                        placeholder="Enter Color"
                        name="color"
                        required
                        error={ !actionData?.success && (actionData?.errors?.color?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Create
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default TagsCreateModal
