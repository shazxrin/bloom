import type { MetaFunction } from "@remix-run/node"
import { Stack, Title } from "@mantine/core"
import React from "react"
import apiClient from "~/api/apiClient.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle } from "@tabler/icons-react"
import { serverError } from "~/utils/responses.client"
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import { format } from "date-fns"
import DashboardDailyOverview from "~/components/dashboard/daily-overview"

const meta: MetaFunction = () => {
    return [
        { title: "Bloom" },
        { name: "description", content: "Personal gamified time and habit tracker" },
    ]
}

const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url)
    const dailyOverviewDate = format(url.searchParams.get("daily") ?? new Date, "yyyy-MM-dd")

    const {
        data: dailyOverview,
        error: getDailyOverviewError
    } = await apiClient.GET("/api/overview/daily", {
        params: {
            query: {
                date: dailyOverviewDate
            }
        }
    })

    if (getDailyOverviewError) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching daily overview.",
            icon: <IconAlertTriangle size={ 18 }/>
        })

        throw serverError()
    }

    return {
        dailyOverview
    }
}

const Index = () => {
    const { dailyOverview } = useLoaderData<typeof clientLoader>()

    return (
        <Stack px={ 16 } pt={ 24 } w="100%" h="100%">
            <Title order={ 1 }>Dashboard</Title>

            <DashboardDailyOverview {...dailyOverview} />
        </Stack>
    )
}

export {
    meta,
    clientLoader
}
export default Index
