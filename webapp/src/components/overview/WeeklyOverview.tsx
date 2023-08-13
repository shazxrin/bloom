import useOverviewStore from "../../stores/overviewStore.ts"
import useMobile from "../../hooks/useMobile.ts"
import {Box, Paper, Stack, Title, useMantineTheme} from "@mantine/core"
import {useEffect, useState} from "react"
import {DateTotalDurationDto} from "../../api/dto.ts"
import {addDays, format, startOfWeek} from "date-fns"
import {ResponsiveLine} from "@nivo/line"

export default function WeeklyOverview() {
    const {weeklyOverview} = useOverviewStore((state) => ({
        weeklyOverview: state.weeklyOverview
    }))

    const [fullWeeklyOverview, setFullWeeklyOverview] = useState<DateTotalDurationDto[]>([])
    useEffect(() => {
        const firstDayOfWeek = startOfWeek(new Date(), {weekStartsOn: 1})
        const days = new Map<string, number>()
        const noOfDays = [...Array(7).keys()]
        noOfDays.forEach(v => {
            days.set(format(addDays(firstDayOfWeek, v), "yyyy-MM-dd"), 0)
        })

        weeklyOverview.forEach(v => {
            days.set(v.date, v.totalDuration)
        })

        const newWeeklyOverview: DateTotalDurationDto[] = []
        for (const [key, value] of days.entries()) {
            newWeeklyOverview.push({
                date: key,
                totalDuration: value
            })
        }

        setFullWeeklyOverview(newWeeklyOverview)
    }, [weeklyOverview])

    const isMobile = useMobile()

    const theme = useMantineTheme()

    return (
        <Stack>
            <Title order={2} color={theme.colors.gray[5]}>This Week</Title>

            <Paper withBorder={true} px={16} py={isMobile ? 4 : 16} bg={theme.colors.dark[8]}
                   style={{
                       overflowX: "auto",
                       overflowY: "hidden"
                   }}>
                <Box h={360} w={isMobile ? 640 : "100%"}>
                    <ResponsiveLine
                        data={[{
                            id: "default",
                            color: theme.colors.pink[4],
                            data: fullWeeklyOverview.map(dateTotalDuration => ({
                                x: dateTotalDuration.date,
                                y: dateTotalDuration.totalDuration / 3600
                            }))
                        }]}
                        colors={{ datum: "color" }}
                        enableArea={true}
                        enableGridX={false}
                        enableGridY={false}
                        margin={{top: 40, right: 40, bottom: 40, left: 40}}/>
                </Box>
            </Paper>
        </Stack>
    )
}
