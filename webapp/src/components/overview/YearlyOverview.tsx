import {Box, Paper, Title, useMantineTheme} from "@mantine/core"
import useOverviewStore from "../../stores/overviewStore.ts"
import {ResponsiveCalendar} from "@nivo/calendar"
import {endOfYear, startOfYear} from "date-fns"
import useMobile from "../../hooks/useMobile.ts"

const MAX_HOURS = 8

export default function YearlyOverview() {
    const {yearlyOverview} = useOverviewStore((state) => ({
        yearlyOverview: state.yearlyOverview
    }))

    const isMobile = useMobile()

    const theme = useMantineTheme()

    return (
        <>
            <Title order={2} color={theme.colors.gray[5]}>This Year</Title>

            <Paper withBorder={true} px={16} py={isMobile ? 4 : 16} bg={theme.colors.dark[8]} style={{
                overflowX: "auto",
                overflowY: "hidden"
            }}>
                <Box h={240} w={isMobile ? 960 : "100%"}>
                    <ResponsiveCalendar
                        data={yearlyOverview.map(dateTotalDurationDto => ({
                            day: dateTotalDurationDto.date,
                            value: dateTotalDurationDto.totalDuration
                        }))}
                        margin={{top: 10, right: 10, bottom: 10, left: 10}}
                        from={startOfYear(new Date())}
                        to={endOfYear(new Date())}
                        emptyColor={theme.colors.gray[8]}
                        monthBorderWidth={3}
                        maxValue={MAX_HOURS * 3600}
                        colors={theme.colors.pink.slice(2)}
                    />
                </Box>
            </Paper>
        </>
    )
}