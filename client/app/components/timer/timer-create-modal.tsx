import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useEffect } from "react"
import { clientAction } from "~/routes/timer"

type TimerCreateModalProps = {
    tags: {
        id: string
        name: string
        color: string
    }[]
    opened: boolean
    close: () => void
}

const TimerCreateModal = ({ opened, close, tags }: TimerCreateModalProps) => {
    const actionData = useActionData<typeof clientAction>()
    useEffect(() => {
        if (actionData?.success) {
            close()
        }
    }, [actionData])

    const navigation = useNavigation()

    return (
        <Modal opened={ opened } onClose={ close } title="New Session" centered>
            <Form method="POST" action="/timer">
                <input type="hidden" name="intent" value="create"/>
                <Stack gap={ 16 }>
                    <TextInput
                        label="Name"
                        placeholder="Enter Name"
                        name="name"
                        required
                        error={ !actionData?.success && (actionData?.errors?.name?.join(", ") ?? "") }
                    />
                    <Group grow>
                        <NumberInput
                            label="Hours"
                            min={ 0 }
                            max={ 23 }
                            defaultValue={ 0 }
                            name="hours"
                            required
                            error={ !actionData?.success && (actionData?.errors?.hours?.join(", ") ?? "") }
                        />
                        <NumberInput
                            label="Minutes"
                            min={ 0 }
                            max={ 59 }
                            defaultValue={ 0 }
                            name="minutes"
                            required
                            error={ !actionData?.success && (actionData?.errors?.minutes?.join(", ") ?? "") }
                        />
                    </Group>

                    <Select
                        label="Tag"
                        placeholder="Select Tag"
                        data={ tags.map(tag => ({ value: tag.id.toString(), label: tag.name })) }
                        name="tagId"
                        required
                        error={ !actionData?.success && (actionData?.errors?.tagId?.join(", ") ?? "") }
                    />

                    <Button type="submit" loading={ navigation.state === "submitting" }>
                        Create
                    </Button>
                </Stack>
            </Form>
        </Modal>
    )
}

export default TimerCreateModal
