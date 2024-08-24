import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/session.history"
import { DateTimePicker } from "@mantine/dates"

type SessionHistoryCreateModalProps = {
    tags: {
        id: string
        name: string
        color: string
    }[]
    opened: boolean
    close: () => void
}

const SessionHistoryCreateModal = ({ opened, close, tags }: SessionHistoryCreateModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title={ "New Session" } centered={ true }>
            <Form method={ "POST" } action={ "/session/history" }>
                <Stack gap={ 16 }>
                    <TextInput
                        label={ "Name" }
                        placeholder={ "Enter Name" }
                        name={ "name" }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("name")?.join(", ") ?? "") }
                    />

                    <DateTimePicker
                        label={ "Start Date Time" }
                        placeholder={ "Pick Date Time" }
                        defaultValue={ new Date() }
                        maxDate={ new Date() }
                        name={ "startDateTime" }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("startDateTime")?.join(", ") ?? "") }
                    />

                    <Group grow>
                        <NumberInput
                            label={ "Hours" }
                            min={ 0 }
                            max={ 23 }
                            defaultValue={ 0 }
                            name={ "hours" }
                            required={ true }
                            error={ !actionData?.success && (actionData?.errors?.get("hours")?.join(", ") ?? "") }
                        />
                        <NumberInput
                            label={ "Minutes" }
                            min={ 0 }
                            max={ 59 }
                            defaultValue={ 0 }
                            name={ "minutes" }
                            required={ true }
                            error={ !actionData?.success && (actionData?.errors?.get("minutes")?.join(", ") ?? "") }
                        />
                    </Group>

                    <Select
                        label={ "Tag" }
                        placeholder={ "Select Tag" }
                        data={ tags.map(tag => ({ value: tag.id.toString(), label: tag.name })) }
                        name={ "tagId" }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("tagId")?.join(", ") ?? "") }
                    />

                    <Button type={ "submit" } loading={ navigation.state === "submitting" }>
                        Create
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default SessionHistoryCreateModal
