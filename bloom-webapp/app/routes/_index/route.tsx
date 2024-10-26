import { Divider, Stack, Title } from "@mantine/core"
import React from "react"
import { useLoaderData } from "@remix-run/react"
import DashboardDailyOverview from "~/routes/_index/components/daily-overview"
import DashboardWeeklyOverview from "~/routes/_index/components/weekly-overview"
import DashboardYearlyOverview from "~/routes/_index/components/yearly-overview";
import { loader, LoaderData } from "~/routes/_index/loader.server"

export {
    loader
}

export default function IndexPage() {
    const { dailyOverview, weeklyOverview, yearlyOverview } = useLoaderData<LoaderData>()

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
