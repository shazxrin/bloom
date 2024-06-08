import { Card, Center, ColorSwatch, Grid, Group, Stack, Text, Title } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar, IconMoodPuzzled } from "@tabler/icons-react"
import { format, parse } from "date-fns"
import { PieChart } from "@mantine/charts"
import { extractHours, extractMinutes } from "~/utils/duration.client"
import React from "react"
import { useSearchParams } from "@remix-run/react"

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
        ? parse(dailyOverviewDateStr, "yyyy-MM-dd", new Date())
        : new Date()

    return (
        <Stack mt={ 8 }>
            <Group justify={ "space-between" }>
                <Title order={ 2 }>Daily</Title>

                <Group>
                    <DatePickerInput
                        value={ dailyOverviewDate }
                        leftSection={ <IconCalendar size={ 18 }/> }
                        onChange={ (newDate) => {
                            if (newDate == null) {
                                return
                            }
                            setSearchParams((prev) => {
                                prev.set("daily", format(newDate, "yyyy-MM-dd"))
                                return prev
                            })
                        } }
                        maxDate={ new Date() }
                    />
                </Group>
            </Group>

            <Card>
                <Grid py={ 8 } px={ 4 } align={ "center" }>
                    <Grid.Col span={ 4 }>
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
                    </Grid.Col>

                    <Grid.Col span={ 8 }>
                        <Stack my={ 16 }>
                            <Stack>
                                <Title order={ 4 }>SUMMARY</Title>
                                <Text size={ "24px" }>
                                    { `${ extractHours(dailyTotalDurationSum) } hours and ${ extractMinutes(dailyTotalDurationSum) } minutes` }
                                </Text>
                            </Stack>

                            <Stack>
                                <Title order={ 4 } mt={ 16 }>BREAKDOWN</Title>
                                {
                                    sessionTagTotalDurations.length === 0
                                        ? <Text size={ "sm" }> No sessions created</Text>
                                        : <Group>
                                            {
                                                sessionTagTotalDurations.map((sessionTagTotalDuration) => (
                                                    <Group>
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
