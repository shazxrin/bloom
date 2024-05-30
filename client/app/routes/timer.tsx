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
import { IconAlertTriangle, IconCheck, IconInputX, IconPlayerPause, IconSparkles } from "@tabler/icons-react"
import { z } from "zod"
import { badRequest, methodNotAllowed, serverError } from "~/utils/responses.client"

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
    if (request.method !== "POST") {
        throw methodNotAllowed()
    }

    const formSchema = z.union([
        z.object({
            intent: z.enum(["resume", "pause", "end"]),
        }),
        z.object({
            intent: z.literal("create"),
            name: z.string().min(1).max(255),
            hours: z.coerce.number().min(0).max(23),
            minutes: z.coerce.number().min(0).max(59),
            tagId: z.string()
        })
    ])

    const formData = await request.formData()
    const formValues = Object.fromEntries(formData.entries())

    const parsedFormValuesResult = formSchema.safeParse(formValues)
    if (!parsedFormValuesResult.success) {
        const errors = new Map(Object.entries(parsedFormValuesResult.error.flatten().fieldErrors))

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
    if (parsedFormValues.intent === "create") {
        const { name, hours, minutes, tagId } = parsedFormValues

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
    } else if (parsedFormValues.intent === "pause") {
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
    } else if (parsedFormValues.intent === "resume") {
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
    } else if (parsedFormValues.intent === "end") {
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
