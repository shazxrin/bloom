import { Stack, Title } from "@mantine/core"
import {
    ClientActionFunctionArgs,
    ClientLoaderFunctionArgs,
    useLoaderData
} from "@remix-run/react"
import AnimatedPage from "~/components/animation/animated-page"
import React from "react"
import TimerSession from "~/components/timer/timer-session"
import TimerCreate from "~/components/timer/timer-create"
import apiClient from "~/api/apiClient.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle, IconCheck, IconPlayerPause, IconSparkles } from "@tabler/icons-react"
import { z } from "zod"
import { badRequest, methodNotAllowed, serverError } from "~/utils/responses.client"
import parseFormData from "~/utils/parse-form-data"

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
            message: "An error occurred while fetching current session.",
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
                color: "pink",
                title: "New session started",
                message: "Session successfully created.",
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
                color: "pink",
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
                color: "pink",
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
                color: "pink",
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

const Timer = () => {
    const { currentSession, tags } = useLoaderData<typeof clientLoader>()

    return (
        <AnimatedPage>
            <Stack px={ 16 } pt={ 24 } w="100%" h="100%">
                <Title order={ 1 }>Timer</Title>

                { currentSession
                    ? <TimerSession { ...currentSession } />
                    : <TimerCreate tags={ tags }/>
                }
            </Stack>
        </AnimatedPage>
    )
}

export {
    clientLoader,
    clientAction
}
export default Timer
