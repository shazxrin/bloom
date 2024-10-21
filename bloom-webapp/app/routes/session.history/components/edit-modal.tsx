import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { extractHours, extractMinutes } from "~/utils/duration"
import { ActionData } from "~/routes/session.history/action.server"
import { useEffect } from "react"

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

export default function SessionHistoryEditModal({ session, tags, opened, close }: SessionHistoryEditModalProps) {
    const actionData = useActionData<ActionData>()
    useEffect(() => {
        // Close modal if session is updated successfully
        if (actionData && actionData.action === "update" && actionData.success) {
            close()
        }
    }, [actionData]);

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
                    />

                    <DateTimePicker
                        label={ "Start Date Time" }
                        placeholder={ "Pick Date Time" }
                        name={ "startDateTime" }
                        defaultValue={ new Date(session.startDateTime) }
                        maxDate={ new Date() }
                        required={ true }
                    />

                    <Group grow={ true }>
                        <NumberInput
                            label={ "Hours" }
                            min={ 0 }
                            max={ 23 }
                            defaultValue={ extractHours(session.totalDuration) }
                            name={ "hours" }
                            required={ true }
                        />
                        <NumberInput
                            label={ "Minutes" }
                            min={ 0 }
                            max={ 59 }
                            defaultValue={ extractMinutes(session.totalDuration) }
                            name={ "minutes" }
                            required={ true }
                        />
                    </Group>

                    <Select
                        label={ "Tag" }
                        placeholder={ "Select Tag" }
                        data={ tags.map(tag => ({ value: tag.id, label: tag.name })) }
                        name={ "tagId" }
                        defaultValue={ session.tag.id }
                        required={ true }
                    />

                    <Button type={ "submit" } loading={ navigation.state === "submitting" }>
                        Update
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}
