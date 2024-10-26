import { Divider, Stack, Title } from "@mantine/core"
import { useActionData, useLoaderData } from "@remix-run/react"
import SessionTimerDetails from "~/routes/session.timer/components/details"
import SessionTimerCreate from "~/routes/session.timer/components/create"
import { loader, LoaderData } from "~/routes/session.timer/loader.server";
import { action, ActionData } from "~/routes/session.timer/action.server";
import React, { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
    IconAlertTriangle,
    IconCheck,
    IconPlayerPause,
    IconPlayerPlay,
    IconSparkles,
} from "@tabler/icons-react";

export {
    loader,
    action
}

export default function SessionTimerPage() {
    const { currentSession, tags } = useLoaderData<LoaderData>()
    const actionData = useActionData<ActionData>()

    // Notifications
    useEffect(() => {
        if (!actionData) { return }

        if (actionData.action === "create") {
            if (actionData.success) {
                notifications.show({
                    color: "green",
                    title: "Timer created",
                    message: "Timer successfully created.",
                    icon: <IconSparkles size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while creating timer.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "pause") {
            if (actionData.success) {
                notifications.show({
                    color: "orange",
                    title: "Timer paused",
                    message: "Timer successfully paused.",
                    icon: <IconPlayerPause size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while pausing timer.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "resume") {
            if (actionData.success) {
                notifications.show({
                    color: "green",
                    title: "Timer resumed",
                    message: "Timer successfully resumed.",
                    icon: <IconPlayerPlay size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while resuming timer.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        } else if (actionData.action === "end") {
            if (actionData.success) {
                notifications.show({
                    color: "green",
                    title: "Timer ended",
                    message: "Timer successfully ended.",
                    icon: <IconCheck size={ 18 }/>
                })

                close()
            } else {
                notifications.show({
                    color: "red",
                    title: "Error occurred!",
                    message: "An error occurred while ending timer.",
                    icon: <IconAlertTriangle size={ 18 }/>
                })
            }
        }
    }, [actionData])

    return (
        <Stack pt={ 16 } w="100%" h="100%">
            <Title order={ 1 }>Timer</Title>

            <Divider />

            { currentSession
                ? <SessionTimerDetails { ...currentSession } />
                : <SessionTimerCreate tags={ tags }/>
            }
        </Stack>
    )
}
