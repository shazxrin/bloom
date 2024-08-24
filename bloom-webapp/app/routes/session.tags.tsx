import { Badge, Divider, Group, Stack, Table, Text, Title } from "@mantine/core"
import React from "react"
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import apiClient from "~/api/apiClient.client"
import { methodNotAllowed, serverError } from "~/utils/responses.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconPencil, IconSparkles, IconTrash } from "@tabler/icons-react"
import { z } from "zod"
import parseFormData from "~/utils/parse-form-data"
import SessionTagsCreateButton from "~/components/session/tags/create-button"
import SessionTagsEditActionButton from "~/components/session/tags/edit-action-button"
import SessionTagsDeleteActionButton from "~/components/session/tags/delete-action-button"

const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
    const {
        data: tags,
        error: getTagsError
    } = await apiClient.GET("/api/session/tag/all")

    if (getTagsError) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching tags.",
            icon: <IconAlertTriangle size={ 18 }/>
        })

        throw serverError()
    }

    return {
        tags
    }
}

const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    if (request.method === "POST") {
        const formSchema = z.object({
            name: z.string().min(1).max(255),
            color: z.string().startsWith("#").length(7),
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { name, color } = formData

        const { error } = await apiClient.POST("/api/session/tag", {
            body: {
                name,
                color
            }
        })

        if (error) {
            notifications.show({
                color: "red",
                title: "Error occurred!",
                message: "An error occurred while creating tag.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "green",
            title: "Tag created",
            message: "Tag successfully created.",
            icon: <IconSparkles size={ 18 }/>
        })

        return {
            success: true
        }
    } else if (request.method === "PUT") {
        const formSchema = z.object({
            id: z.string().min(1),
            name: z.string().min(1).max(255),
            color: z.string().startsWith("#").length(7)
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { id, name, color } = formData

        const { error } = await apiClient.PUT("/api/session/tag/{id}", {
            params: {
                path: {
                    id
                }
            },
            body: {
                name,
                color
            }
        })

        if (error) {
            notifications.show({
                color: "red",
                title: "Error occurred!",
                message: "An error occurred while updating tag.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "blue",
            title: "Tag updated",
            message: "Tag successfully updated.",
            icon: <IconPencil size={ 18 }/>
        })

        return {
            success: true
        }
    } else if (request.method === "DELETE") {
        const formSchema = z.object({
            id: z.string()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { id } = formData

        const { error } = await apiClient.DELETE("/api/session/tag/{id}", {
            params: {
                path: {
                    id
                }
            }
        })

        if (error) {
            notifications.show({
                color: "red",
                title: "Error occurred!",
                message: "An error occurred while deleting tag.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "red",
            title: "Tag deleted",
            message: "Tag successfully deleted.",
            icon: <IconTrash size={ 18 }/>
        })

        return {
            success: true
        }
    } else {
        throw methodNotAllowed()
    }
}

const SessionTags = () => {
    const { tags } = useLoaderData<typeof clientLoader>()

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

export {
    clientLoader,
    clientAction
}
export default SessionTags
