import {Space, Stack, Title} from "@mantine/core"
import useOverviewStore from "../../stores/overviewStore.ts"
import {useEffect} from "react"
import DailyOverview from "../../components/overview/DailyOverview.tsx"
import YearlyOverview from "../../components/overview/YearlyOverview.tsx"
import useMobile from "../../hooks/useMobile.ts"
import WeeklyOverview from "../../components/overview/WeeklyOverview.tsx"
import useShellStore from "../../stores/shellStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"

export default function Overview() {
    const {fetchCategories}  = useCategoryStore((state) => ({
        fetchCategories: state.fetchCategories
    }))

    const {getDailyOverview, getWeeklyOverview, getYearlyOverview} = useOverviewStore((state) => ({
        getDailyOverview: state.getDailyOverview,
        getWeeklyOverview: state.getWeeklyOverview,
        getYearlyOverview: state.getYearlyOverview
    }))

    const {setRefreshCallback} = useShellStore((state) => ({
        setRefreshCallback: state.setRefreshCallback
    }))

    useEffect(() => {
        fetchCategories()
        getDailyOverview()
        getWeeklyOverview()
        getYearlyOverview()

        setRefreshCallback(() => {
            fetchCategories()
            getDailyOverview()
            getWeeklyOverview()
            getYearlyOverview()
        })
    }, [])

    const isMobile = useMobile()

    return (
        <Stack w={"100%"} h={"100%"} maw={960} mx={"auto"} px={isMobile ? 4 : 16} py={32}>
            <Title order={1} mb={16}>Overview</Title>

            <DailyOverview/>
            <Space mt={8}/>
            <WeeklyOverview/>
            <Space mt={8}/>
            <YearlyOverview/>
        </Stack>
    )
}