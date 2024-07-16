import { Card, Center, ColorSwatch, Divider, Grid, Group, Stack, Text, Title, useMatches } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar, IconMoodPuzzled } from "@tabler/icons-react"
import { format, parse } from "date-fns"
import { PieChart } from "@mantine/charts"
import { extractHours, extractMinutes } from "~/utils/duration.client"
import React from "react"
import { useSearchParams } from "@remix-run/react"

const dateFormat = "yyyy-MM-dd"

type DashboardDailyOverviewProps = {
    sessionTagTotalDurations: {
        tag: {
            id: string,
            name: string,
            color: string
        }
        totalDuration: number
    }[]
}

const DashboardDailyOverview = ({ sessionTagTotalDurations }: DashboardDailyOverviewProps) => {
    const dailyTotalDurationSum = sessionTagTotalDurations
        .map(sessionTagTotalDuration => sessionTagTotalDuration.totalDuration)
        .reduce((previousValue, totalDuration) => previousValue + totalDuration, 0)

    const [searchParams, setSearchParams] = useSearchParams()
    const dailyOverviewDateStr = searchParams.get("daily")
    const dailyOverviewDate = dailyOverviewDateStr
        ? parse(dailyOverviewDateStr, dateFormat, new Date())
        : new Date()

    const chartColSpan = useMatches({
        sm: 1,
        lg: 4
    })
    const summaryBreakdownColSpan = useMatches({
        sm: 1,
        lg: 8
    })

    return (
        <Stack mt={ 8 }>
            <Group justify={ "space-between" } mb={ 8 }>
                <Title order={ 2 } c={ "dimmed" }>Daily</Title>

                <Group>
                    <DatePickerInput
                        value={ dailyOverviewDate }
                        leftSection={ <IconCalendar size={ 18 }/> }
                        onChange={ (newDate) => {
                            if (newDate == null) {
                                return
                            }
                            setSearchParams((prev) => {
                                prev.set("daily", format(newDate, dateFormat))
                                return prev
                            })
                        } }
                        maxDate={ new Date() }
                    />
                </Group>
            </Group>

            <Card py={ 42 } px={ 42 }>
                <Grid align={ "start" } gutter={ 24 }>
                    <Grid.Col span={ chartColSpan }>
                        <Group gap={ 0 } justify={ "space-between" }>
                            <Stack>
                                <Title c={ "dimmed" } order={ 5 } td={ "underline" }>CHART</Title>

                                <Center>
                                    {
                                        sessionTagTotalDurations.length === 0
                                            ? <IconMoodPuzzled size={ 120 }/>
                                            : <PieChart
                                                data={
                                                    sessionTagTotalDurations.map((sessionTagTotalDuration) => ({
                                                        name: sessionTagTotalDuration.tag.name,
                                                        value: Number((sessionTagTotalDuration.totalDuration / 3600).toFixed(2)),
                                                        color: sessionTagTotalDuration.tag.color
                                                    }))
                                                }
                                                size={ 240 }
                                                withTooltip
                                                tooltipDataSource={ "segment" }
                                                withLabels
                                                withLabelsLine
                                                labelsPosition={ "outside" }
                                                labelsType={ "value" }
                                                strokeWidth={ 1.5 }
                                            />
                                    }
                                </Center>
                            </Stack>

                        </Group>
                    </Grid.Col>

                    <Grid.Col span={ summaryBreakdownColSpan }>
                        <Stack>
                            <Stack>
                                <Title c={ "dimmed" } order={ 5 } td={ "underline" }>SUMMARY</Title>
                                <Text size={ "24px" }>
                                    { `${ extractHours(dailyTotalDurationSum) } hours and ${ extractMinutes(dailyTotalDurationSum) } minutes` }
                                </Text>
                            </Stack>

                            <Stack mt={ 16 }>
                                <Title c={ "dimmed" } order={ 5 } td={ "underline" }>BREAKDOWN</Title>
                                {
                                    sessionTagTotalDurations.length === 0
                                        ? <Text size={ "sm" }> No sessions created</Text>
                                        : <Group>
                                            {
                                                sessionTagTotalDurations.map((sessionTagTotalDuration) => (
                                                    <Group key={ sessionTagTotalDuration.tag.id }>
                                                        <ColorSwatch color={ sessionTagTotalDuration.tag.color }
                                                                     size={ "16px" }/>
                                                        <Stack gap={ 1 }>
                                                            <Text size={ "sm" } fw={ "bold" }>
                                                                { sessionTagTotalDuration.tag.name }
                                                            </Text>
                                                            <Text size={ "sm" }>
                                                                { `${ extractHours(sessionTagTotalDuration.totalDuration) } hours and ${ extractMinutes(sessionTagTotalDuration.totalDuration) } minutes` }
                                                            </Text>
                                                        </Stack>
                                                    </Group>
                                                ))
                                            }
                                        </Group>
                                }
                            </Stack>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </Stack>
    )
}

export default DashboardDailyOverview
