import { Group, Stack, Table, Title, Text, Badge, Pagination, Divider } from "@mantine/core"
import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, useLoaderData, useSearchParams } from "@remix-run/react"
import { methodNotAllowed, serverError } from "~/utils/responses.client"
import apiClient from "~/api/apiClient.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconPencil, IconSparkles, IconTrash } from "@tabler/icons-react"
import React from "react"
import SessionHistoryCreateButton from "~/components/session/history/create-button"
import { addSeconds, format } from "date-fns"
import SessionHistoryEditActionButton from "~/components/session/history/edit-action-button"
import SessionHistoryDeleteActionButton from "~/components/session/history/delete-action-button"
import { z } from "zod"
import parseFormData from "~/utils/parse-form-data"
import { formatToLocalISO } from "~/utils/date-time.client"

const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") ?? "1") - 1

    const {
        data: sessionsPage,
        error: getSessionsError
    } = await apiClient.GET("/api/session/all", {
        params: {
            query: {
                page: page
            }
        }
    })
    if (getSessionsError) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching session history.",
            icon: <IconAlertTriangle size={ 18 }/>
        })

        throw serverError()
    }

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
        sessionsPage,
        tags
    }
}

const clientAction = async ({ request }: ClientActionFunctionArgs) => {
    if (request.method === "POST") {
        const formSchema = z.object({
            name: z.string().min(1).max(255),
            tagId: z.string().min(1, "Tag cannot be empty"),
            hours: z.coerce.number().min(0).max(23),
            minutes: z.coerce.number().min(0).max(59),
            startDateTime: z.string().datetime()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { name, startDateTime, hours, minutes, tagId } = formData

        const totalDuration = (hours * 3600) + (minutes * 60)
        const { error: postAddSessionError } = await apiClient.POST("/api/session", {
            body: {
                name,
                tagId,
                totalDuration,
                startDateTime: formatToLocalISO(startDateTime),
                endDateTime: formatToLocalISO(addSeconds(startDateTime, totalDuration))
            }
        })

        if (postAddSessionError) {
            notifications.show({
                color: "red",
                title: "Error occurred!",
                message: "An error occurred while adding session.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "green",
            title: "Session added",
            message: "Session successfully added.",
            icon: <IconSparkles size={ 18 }/>
        })

        return {
            success: true
        }
    } else if (request.method === "PUT") {
        const formSchema = z.object({
            id: z.string().min(1, "Id cannot be empty"),
            name: z.string().min(1).max(255),
            tagId: z.string().min(1, "Tag cannot be empty"),
            hours: z.coerce.number().min(0).max(23),
            minutes: z.coerce.number().min(0).max(59),
            startDateTime: z.string().datetime()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { id, name, startDateTime, hours, minutes, tagId } = formData

        const totalDuration = (hours * 3600) + (minutes * 60)
        const { error: postAddSessionError } = await apiClient.PUT("/api/session/{id}", {
            params: {
                path: {
                    id: id
                }
            },
            body: {
                name,
                tagId,
                totalDuration,
                startDateTime: formatToLocalISO(startDateTime),
                endDateTime: formatToLocalISO(addSeconds(startDateTime, totalDuration))
            }
        })

        if (postAddSessionError) {
            notifications.show({
                color: "red",
                title: "Error occurred!",
                message: "An error occurred while updating session.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "blue",
            title: "Session updated",
            message: "Session successfully updated.",
            icon: <IconPencil size={ 18 }/>
        })

        return {
            success: true
        }
    } else if (request.method === "DELETE") {
        const formSchema = z.object({
            id: z.string().min(1, "Id cannot be empty")
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }
        const { id } = formData

        const { error } = await apiClient.DELETE("/api/session/{id}", {
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
                message: "An error occurred while deleting session.",
                icon: <IconAlertTriangle size={ 18 }/>
            })

            throw serverError()
        }

        notifications.show({
            color: "red",
            title: "Session deleted",
            message: "Session successfully deleted.",
            icon: <IconTrash size={ 18 }/>
        })

        return {
            success: true
        }
    } else {
        throw methodNotAllowed()
    }
}

const SessionHistory = () => {
    const { sessionsPage, tags } = useLoaderData<typeof clientLoader>()

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <Stack my={ 24 } w="100%" mih="100%">
            <Title order={ 1 }>History</Title>

            <Divider my={ 8 } />

            <Group justify="space-between">
                <Pagination
                    total={ sessionsPage.totalPages }
                    value={ parseInt(searchParams.get("page") ?? "1") }
                    onChange={ (newPage) => setSearchParams({ page: newPage.toString() }) }
                />
                <SessionHistoryCreateButton tags={ tags }/>
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
                                { format(session.startDateTime, "dd MMM yyyy HH:mm") }
                            </Table.Td>
                            <Table.Td>
                                { session.endDateTime ? format(session.endDateTime, "dd MMM yyyy HH:mm") : "In Progress" }
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

export {
    clientLoader,
    clientAction
}
export default SessionHistory
