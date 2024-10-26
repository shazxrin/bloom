import { Group, Stack, Table, Title, Text, Badge, Pagination, Divider } from "@mantine/core"
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react"
import { useEffect } from "react"
import SessionHistoryCreateButton from "~/routes/session.history/components/create-button"
import { format } from "date-fns"
import SessionHistoryEditActionButton from "~/routes/session.history/components/edit-action-button"
import SessionHistoryDeleteActionButton from "~/routes/session.history/components/delete-action-button"
import { LoaderData, loader } from "~/routes/session.history/loader.server"
import { ActionData, action } from "~/routes/session.history/action.server"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconPencil, IconSparkles, IconTrash } from "@tabler/icons-react"

export {
    loader,
    action
}

const dateTimeFormat = "dd MMM yyyy hh:mm";

export default function SessionHistoryPage() {
    const { sessionsPage, tags } = useLoaderData<LoaderData>()
    const actionData = useActionData<ActionData>()

    const [searchParams, setSearchParams] = useSearchParams()

    // Notifications
    useEffect(() => {
        if (!actionData) { return }

        if (actionData.action === "create") {
            if (actionData.success) {
                notifications.show({
                    color: "green",
                    title: "Session added",
                    message: "Session successfully added.",
                    icon: <IconSparkles size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while adding session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "delete") {
            if (actionData.success) {
                notifications.show({
                    color: "red",
                    title: "Session deleted",
                    message: "Session successfully deleted.",
                    icon: <IconTrash size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while deleting session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "update") {
            if (actionData.success) {
                notifications.show({
                    color: "orange",
                    title: "Session edited",
                    message: "Session successfully edited.",
                    icon: <IconPencil size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while editing session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        }
    }, [actionData])

    return (
        <Stack pt={ 16 } pb={ 24 } w="100%" mih="100%">
            <Title order={ 1 }>History</Title>

            <Divider/>

            <Group justify="space-between">
                <SessionHistoryCreateButton tags={ tags }/>

                <Pagination
                    total={ sessionsPage.totalPages }
                    value={ parseInt(searchParams.get("page") ?? "1") }
                    onChange={ (newPage) => setSearchParams({ page: newPage.toString() }) }
                />
            </Group>

            <Table highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Tag</Table.Th>
                        <Table.Th>Start Date Time</Table.Th>
                        <Table.Th>End Date Time</Table.Th>
                        <Table.Th>{/* Actions */ }</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    { sessionsPage.items.map(session => (
                        <Table.Tr key={ session.id }>
                            <Table.Td>
                                <Text>{ session.name }</Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge color={ session.tag.color }>
                                    { session.tag.name }
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                { format(session.startDateTime, dateTimeFormat) }
                            </Table.Td>
                            <Table.Td>
                                { session.endDateTime
                                  ? format(session.endDateTime, dateTimeFormat)
                                  : "In Progress" }
                            </Table.Td>
                            <Table.Td>
                                <Group justify="end" align="center">
                                    <SessionHistoryEditActionButton session={ session } tags={ tags }/>
                                    <SessionHistoryDeleteActionButton session={ session }/>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    )) }
                </Table.Tbody>
            </Table>
        </Stack>
    )
}
