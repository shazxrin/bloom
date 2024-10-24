import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Divider, Stack, Title } from "@mantine/core"
import React from "react"
import apiClient from "~/api/apiClient"
import { ok, serverError } from "~/utils/responses.server"
import { useLoaderData } from "@remix-run/react"
import { format } from "date-fns"
import DashboardDailyOverview from "~/components/dashboard/daily-overview"
import DashboardWeeklyOverview from "~/components/dashboard/weekly-overview"
import DashboardYearlyOverview from "~/components/dashboard/yearly-overview";

const meta: MetaFunction = () => {
    return [
        { title: "Bloom" },
        { name: "description", content: "Personal gamified time and habit tracker" },
    ]
}

const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const dailyOverviewDate = format(url.searchParams.get("daily") ?? new Date, "yyyy-MM-dd")
    const weeklyOverviewDate = format(url.searchParams.get("weekly") ?? new Date, "yyyy-MM-dd")
    const yearlyOverviewDate = format(url.searchParams.get("yearly") ?? new Date, "yyyy")

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

    const yearlyOverviewPromise = await apiClient.GET("/api/overview/yearly", {
        params: {
            query: {
                year: parseInt(yearlyOverviewDate)
            }
        }
    })

    const [dailyOverviewResponse, weeklyOverviewResponse, yearlyOverviewResponse]
        = await Promise.all([dailyOverviewPromise, weeklyOverviewPromise, yearlyOverviewPromise])

    if (dailyOverviewResponse.error
        || weeklyOverviewResponse.error
        || yearlyOverviewResponse.error
    ) {
        throw serverError()
    }

    return json({
        dailyOverview: dailyOverviewResponse.data,
        weeklyOverview: weeklyOverviewResponse.data,
        yearlyOverview: yearlyOverviewResponse.data
    }, 200)
}

const Index = () => {
    const { dailyOverview, weeklyOverview, yearlyOverview }
        = useLoaderData<typeof loader>()

    return (
        <Stack pt={ 16 } pb={ 24 } w="100%" mih="100%">
            <Title order={ 1 }>Dashboard</Title>

            <Divider my={ 0 }/>

            <DashboardDailyOverview { ...dailyOverview } />

            <Divider my={ 12 }/>

            <DashboardWeeklyOverview { ...weeklyOverview } />

            <Divider my={ 12 }/>

            <DashboardYearlyOverview { ...yearlyOverview } />
        </Stack>
    )
}

export {
    meta,
    loader
}
export default Index
