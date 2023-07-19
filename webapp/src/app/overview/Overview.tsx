import {Stack, Title} from "@mantine/core"
import useOverviewStore from "../../stores/overviewStore.ts"
import {useEffect} from "react"
import DailyOverview from "../../components/overview/DailyOverview.tsx"

export default function Overview() {
    const {getDailyOverview} = useOverviewStore((state) => ({
        getDailyOverview: state.getDailyOverview
    }))

    useEffect(() => {
        getDailyOverview()
    }, [])

    return (
        <Stack w={"100%"} h={"100%"} p={16}>
            <Title order={1} mb={16}>Overview</Title>

            <DailyOverview />
        </Stack>
    )
}