import { Badge, Divider, Group, Stack, Table, Text, Title } from "@mantine/core"
import React, { useEffect } from "react"
import { useActionData, useLoaderData } from "@remix-run/react"
import SessionTagsCreateButton from "~/routes/session.tags/components/create-button"
import SessionTagsEditActionButton from "~/routes/session.tags/components/edit-action-button"
import SessionTagsDeleteActionButton from "~/routes/session.tags/components/delete-action-button"
import { LoaderData, loader } from "~/routes/session.tags/loader.server";
import { ActionData, action } from "~/routes/session.tags/action.server";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconPencil, IconSparkles, IconTrash } from "@tabler/icons-react";

export {
    loader,
    action
}

export default function SessionTagsPage() {
    const { tags } = useLoaderData<LoaderData>()
    const actionData = useActionData<ActionData>()

    // Notifications
    useEffect(() => {
        if (!actionData) { return }

        if (actionData.action === "create") {
            if (actionData.success) {
                notifications.show({
                    color: "green",
                    title: "Tag added",
                    message: "Tag successfully added.",
                    icon: <IconSparkles size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while adding Tag.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "delete") {
            if (actionData.success) {
                notifications.show({
                    color: "red",
                    title: "Tag deleted",
                    message: "Tag successfully deleted.",
                    icon: <IconTrash size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while deleting tag.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "update") {
            if (actionData.success) {
                notifications.show({
                    color: "orange",
                    title: "Tag edited",
                    message: "Tag successfully edited.",
                    icon: <IconPencil size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while editing tag.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        }
    }, [actionData])

    return (
        <Stack pt={ 16 } pb={ 24 } w="100%" mih="100%">
            <Title order={ 1 }>Tags</Title>

            <Divider />

            <Group justify="space-between">
                <SessionTagsCreateButton/>
            </Group>

            <Table highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>{/* Actions */ }</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    { tags.map(tag => (
                        <Table.Tr key={ tag.id }>
                            <Table.Td>
                                <Group align="center">
                                    <Badge color={ tag.color } circle/>
                                    <Text>{ tag.name }</Text>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Group justify="end" align="center">
                                    <SessionTagsEditActionButton tag={ tag }/>
                                    <SessionTagsDeleteActionButton tag={ tag }/>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    )) }
                </Table.Tbody>
            </Table>
        </Stack>
    )
}
