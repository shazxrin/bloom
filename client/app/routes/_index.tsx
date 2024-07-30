import type { MetaFunction } from "@remix-run/node"
import { Divider, Stack, Title } from "@mantine/core"
import React from "react"
import apiClient from "~/api/apiClient.client"
import { notifications } from "@mantine/notifications"
import { IconAlertTriangle } from "@tabler/icons-react"
import { serverError } from "~/utils/responses.client"
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import { format } from "date-fns"
import DashboardDailyOverview from "~/components/dashboard/daily-overview"
import DashboardWeeklyOverview from "~/components/dashboard/weekly-overview"

const meta: MetaFunction = () => {
    return [
        { title: "Bloom" },
        { name: "description", content: "Personal gamified time and habit tracker" },
    ]
}

const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url)
    const dailyOverviewDate = format(url.searchParams.get("daily") ?? new Date, "yyyy-MM-dd")
    const weeklyOverviewDate = format(url.searchParams.get("weekly") ?? new Date, "yyyy-MM-dd")

    const dailyOverviewPromise = apiClient.GET("/api/overview/daily", {
        params: {
            query: {
                date: dailyOverviewDate
            }
        }
    })

    const weeklyOverviewPromise = await apiClient.GET("/api/overview/weekly", {
        params: {
            query: {
                date: weeklyOverviewDate
            }
        }
    })

    const [dailyOverviewResponse, weeklyOverviewResponse] = await Promise.all([dailyOverviewPromise, weeklyOverviewPromise])

    if (dailyOverviewResponse.error) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching daily overview.",
            icon: <IconAlertTriangle size={ 18 }/>
        })

        throw serverError()
    }

    if (weeklyOverviewResponse.error) {
        notifications.show({
            color: "red",
            title: "Error occurred!",
            message: "An error occurred while fetching weekly overview.",
            icon: <IconAlertTriangle size={ 18 }/>
        })

        throw serverError()
    }

    return {
        dailyOverview: dailyOverviewResponse.data,
        weeklyOverview: weeklyOverviewResponse.data
    }
}

const Index = () => {
    const { dailyOverview, weeklyOverview } = useLoaderData<typeof clientLoader>()

    return (
        <Stack pt={ 16 } pb={ 24 } w="100%" mih="100%">
            <Title order={ 1 }>Dashboard</Title>

            <Divider my={ 0 } />

            <DashboardDailyOverview { ...dailyOverview } />

            <Divider my={ 12 } />

            <DashboardWeeklyOverview { ...weeklyOverview } />
        </Stack>
    )
}

export {
    meta,
    clientLoader
}
export default Index
