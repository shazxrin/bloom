import { Button, ColorInput, Modal, Stack, TextInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/tags"

type TagsEditModalProps = {
    tag: {
        id: string
        name: string
        color: string
    }
    opened: boolean
    close: () => void
}

const TagsEditModal = ({ tag, opened, close }: TagsEditModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title="Edit Tag" centered>
            <Form method="PUT" action={ "/tags" }>
                <input type={ "hidden" } name={ "id" } value={ tag.id }/>
                <Stack gap={ 16 }>
                    <TextInput
                        label="Name"
                        placeholder="Enter Name"
                        name="name"
                        defaultValue={ tag.name }
                        required
                        error={ !actionData?.success && (actionData?.errors?.name?.join(", ") ?? "") }
                    />

                    <ColorInput
                        label="Color"
                        placeholder="Enter Color"
                        name="color"
                        defaultValue={ tag.color }
                        required
                        error={ !actionData?.success && (actionData?.errors?.color?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Update
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default TagsEditModal