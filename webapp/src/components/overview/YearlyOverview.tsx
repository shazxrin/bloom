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
            <Title order={2} color={theme.colors.gray[5]}>Yearly</Title>

            <Paper withBorder={true} px={16} py={isMobile ? 4 : 16} bg={theme.colors.dark[8]} style={{
                overflowX: "auto",
                overflowY: "hidden"
            }}>
                <Box h={240} w={isMobile ? 960 : "100%"}>
                    <ResponsiveCalendar
                        data={yearlyOverview.dates.map(dateTotalDurationDto => ({
                            day: dateTotalDurationDto.date,
                            value: dateTotalDurationDto.totalDuration
                        }))}
                        margin={{top: 0, right: 20, bottom: 0, left: 20}}
                        from={startOfYear(new Date())}
                        to={endOfYear(new Date())}
                        emptyColor={theme.colors.gray[8]}
                        theme={{
                            fontFamily: "DM Sans",
                            textColor: theme.colors.gray[6]
                        }}
                        isInteractive={false}
                        maxValue={MAX_HOURS * 3600}
                        colors={theme.colors.pink.slice(2)}
                    />
                </Box>
            </Paper>
        </>
    )
}