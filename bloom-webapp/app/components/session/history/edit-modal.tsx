import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/session.history"
import { extractHours, extractMinutes } from "~/utils/duration.client"

type SessionHistoryEditModalProps = {
    session: {
        id: string
        name: string,
        totalDuration: number,
        tag: {
            id: string,
            name: string,
            color: string
        },
        startDateTime: string
        endDateTime?: string | undefined
    }
    tags: {
        id: string
        name: string
        color: string
    }[]
    opened: boolean
    close: () => void
}

const SessionHistoryEditModal = ({ session, tags, opened, close }: SessionHistoryEditModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title={ "Edit Session" } centered={ true }>
            <Form method={ "PUT" } action={ "/session/history" }>
                <Stack gap={ 16 }>
                    <input type={ "hidden" } name={ "id" } value={ session.id }/>

                    <TextInput
                        label={ "Name" }
                        placeholder={ "Enter Name" }
                        name={ "name" }
                        defaultValue={ session.name }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("name")?.join(", ") ?? "") }
                    />

                    <DateTimePicker
                        label={ "Start Date Time" }
                        placeholder={ "Pick Date Time" }
                        name={ "startDateTime" }
                        defaultValue={ new Date(session.startDateTime) }
                        maxDate={ new Date() }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("startDateTime")?.join(", ") ?? "") }
                    />

                    <Group grow={ true }>
                        <NumberInput
                            label={ "Hours" }
                            min={ 0 }
                            max={ 23 }
                            defaultValue={ extractHours(session.totalDuration) }
                            name={ "hours" }
                            required={ true }
                            error={ !actionData?.success && (actionData?.errors?.get("hours")?.join(", ") ?? "") }
                        />
                        <NumberInput
                            label={ "Minutes" }
                            min={ 0 }
                            max={ 59 }
                            defaultValue={ extractMinutes(session.totalDuration) }
                            name={ "minutes" }
                            required={ true }
                            error={ !actionData?.success && (actionData?.errors?.get("minutes")?.join(", ") ?? "") }
                        />
                    </Group>

                    <Select
                        label={ "Tag" }
                        placeholder={ "Select Tag" }
                        data={ tags.map(tag => ({ value: tag.id, label: tag.name })) }
                        name={ "tagId" }
                        defaultValue={ session.tag.id }
                        required={ true }
                        error={ !actionData?.success && (actionData?.errors?.get("tagId")?.join(", ") ?? "") }
                    />

                    <Button type={ "submit" } loading={ navigation.state === "submitting" }>
                        Update
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default SessionHistoryEditModal
