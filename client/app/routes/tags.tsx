import AnimatedPage from "~/components/animation/animated-page"
import { Badge, Group, Stack, Table, Text, Title } from "@mantine/core"
import React from "react"
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import TagsCreateButton from "~/components/tags/tags-create-button"
import TagsEditActionButton from "~/components/tags/tags-edit-action-button"
import TagsDeleteActionButton from "~/components/tags/tags-delete-action-button"
import apiClient from "~/api/apiClient.client"
import { methodNotAllowed, serverError } from "~/utils/responses.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconInputX, IconPencil, IconSparkles, IconTrash } from "@tabler/icons-react"
import { z } from "zod"

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

        const formData = await request.formData()
        const formValues = Object.fromEntries(formData.entries())

        const parsedFormValuesResult = formSchema.safeParse(formValues)
        if (!parsedFormValuesResult.success) {
            const errors = parsedFormValuesResult.error.flatten().fieldErrors

            notifications.show({
                color: "red",
                title: "Errors in input!",
                message: "Check errors in form and try again.",
                icon: <IconInputX size={ 18 }/>
            })

            return {
                success: false,
                errors: errors
            }
        }

        const parsedFormValues = parsedFormValuesResult.data

        const { name, color } = parsedFormValues

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
            color: "pink",
            title: "Tag created",
            message: "Session successfully created.",
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

        const formData = await request.formData()
        const formValues = Object.fromEntries(formData.entries())

        const parsedFormValuesResult = formSchema.safeParse(formValues)
        if (!parsedFormValuesResult.success) {
            const errors = parsedFormValuesResult.error.flatten().fieldErrors

            notifications.show({
                color: "red",
                title: "Errors in input!",
                message: "Check errors in form and try again.",
                icon: <IconInputX size={ 18 }/>
            })

            return {
                success: false,
                errors: errors
            }
        }

        const parsedFormValues = parsedFormValuesResult.data

        const { id, name, color } = parsedFormValues

        const { error } = await apiClient.PATCH("/api/session/tag/{id}", {
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
            color: "pink",
            title: "Tag updated",
            message: "Session successfully updated.",
            icon: <IconPencil size={ 18 }/>
        })

        return {
            success: true
        }
    } else if (request.method === "DELETE") {
        const formSchema = z.object({
            id: z.string()
        })

        const formData = await request.formData()
        const formValues = Object.fromEntries(formData.entries())

        const parsedFormValuesResult = formSchema.safeParse(formValues)
        if (!parsedFormValuesResult.success) {
            const errors = parsedFormValuesResult.error.flatten().fieldErrors

            notifications.show({
                color: "red",
                title: "Errors in input!",
                message: "Check errors in form and try again.",
                icon: <IconInputX size={ 18 }/>
            })

            return {
                success: false,
                errors: errors
            }
        }

        const parsedFormValues = parsedFormValuesResult.data

        const { id } = parsedFormValues

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
            color: "pink",
            title: "Tag updated",
            message: "Session successfully updated.",
            icon: <IconTrash size={ 18 }/>
        })

        return {
            success: true
        }
    } else {
        throw methodNotAllowed()
    }
}

const Tags = () => {
    const { tags } = useLoaderData<typeof clientLoader>()

    return (
        <AnimatedPage>
            <Stack px={ 16 } pt={ 24 } w="100%" h="100%">
                <Title order={ 1 }>Tags</Title>

                <Group mt={ 16 } justify="start">
                    <TagsCreateButton/>
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
                                        <TagsEditActionButton tag={ tag }/>
                                        <TagsDeleteActionButton tag={ tag }/>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        )) }
                    </Table.Tbody>
                </Table>
            </Stack>
        </AnimatedPage>
    )
}

export {
    clientLoader,
    clientAction
}
export default Tags
