import { Divider, Stack, Title } from "@mantine/core"
import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import React from "react"
import apiClient from "~/api/apiClient.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconCheck, IconPlayerPause, IconSparkles } from "@tabler/icons-react"
import { z } from "zod"
import { badRequest, methodNotAllowed, serverError } from "~/utils/responses.client"
import parseFormData from "~/utils/parse-form-data"
import SessionTimerDetails from "~/components/session/timer/details"
import SessionTimerCreate from "~/components/session/timer/create"

const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
    const {
        data: currentSession,
        error: getCurrentSessionError,
        response: getCurrentSessionResponse
    } = await apiClient.GET("/api/session/current")

    if (getCurrentSessionError) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching current session.",
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
        currentSession: getCurrentSessionResponse.status == 200 ? currentSession : null,
        tags
    }
}

const clientAction = async ({ request }: ClientActionFunctionArgs) => {
    if (request.method === "POST") {
        const formSchema = z.union([
            z.object({
                intent: z.enum(["resume", "pause", "end"]),
            }),
            z.object({
                intent: z.literal("create"),
                name: z.string().min(1).max(255),
                hours: z.coerce.number().min(0).max(23),
                minutes: z.coerce.number().min(0).max(59),
                tagId: z.string().min(1)
            })
        ])

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return {
                success: false,
                errors
            }
        }

        if (formData.intent === "create") {
            const { name, hours, minutes, tagId } = formData

            const { error } = await apiClient.POST("/api/session/current/create", {
                body: {
                    name: name,
                    tagId: tagId,
                    totalDuration: (hours * 3600) + (minutes * 60)
                }
            })

            if (error) {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while creating current session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })

                throw serverError()
            }

            notifications.show({
                color: "green",
                title: "Session started",
                message: "Session successfully started.",
                icon: <IconSparkles size={ 18 }/>
            })
        } else if (formData.intent === "pause") {
            const { error } = await apiClient.POST("/api/session/current/pause")

            if (error) {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while pausing current session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })

                throw serverError()
            }

            notifications.show({
                color: "orange",
                title: "Session paused",
                message: "Session successfully paused.",
                icon: <IconPlayerPause size={ 18 }/>
            })
        } else if (formData.intent === "resume") {
            const { error } = await apiClient.POST("/api/session/current/resume")

            if (error) {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while resuming current session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })

                throw serverError()
            }

            notifications.show({
                color: "green",
                title: "Session resumed",
                message: "Session successfully resumed.",
                icon: <IconPlayerPause size={ 18 }/>
            })
        } else if (formData.intent === "end") {
            const { error } = await apiClient.POST("/api/session/current/end")

            if (error) {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while ending current session.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })

                throw serverError()
            }

            notifications.show({
                color: "green",
                title: "Session ended",
                message: "Session successfully ended.",
                icon: <IconCheck size={ 18 }/>
            })
        } else {
            throw badRequest()
        }

        return {
            success: true
        }
    } else {
        throw methodNotAllowed()
    }
}

const SessionTimer = () => {
    const { currentSession, tags } = useLoaderData<typeof clientLoader>()

    return (
        <Stack my={ 24 } w="100%" h="100%">
            <Title order={ 1 }>Timer</Title>

            <Divider my={ 8 } />

            { currentSession
                ? <SessionTimerDetails { ...currentSession } />
                : <SessionTimerCreate tags={ tags }/>
            }
        </Stack>
    )
}

export {
    clientLoader,
    clientAction
}
export default SessionTimer
