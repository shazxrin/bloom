import { Card, Center, ColorSwatch, Divider, Group, Stack, Text, Title } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"
import { addDays, format, parse, startOfWeek } from "date-fns"
import { LineChart } from "@mantine/charts"
import { extractHours, extractMinutes } from "~/utils/duration.client"
import React from "react"
import { useSearchParams } from "@remix-run/react"

const dateFormat = "yyyy-MM-dd"
const weeklyDateFormat = "EEE, dd MMM"

type DashboardWeeklyOverviewProps = {
    sessionDateTotalDurations: {
        date: string,
        totalDuration: number
    }[]
    sessionTagTotalDurations: {
        tag: {
            id: string,
            name: string,
            color: string
        }
        totalDuration: number
    }[]    
}

const DashboardWeeklyOverview = ({ sessionDateTotalDurations, sessionTagTotalDurations }: DashboardWeeklyOverviewProps) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const weeklyOverviewDateStr = searchParams.get("weekly")
    const weeklyOverviewDate = weeklyOverviewDateStr
        ? parse(weeklyOverviewDateStr, dateFormat, new Date())
        : new Date()

    const weeklyOverviewDateTotalDurations: Map<string, number> = new Map<string, number>()
    let weeklyDate = startOfWeek(weeklyOverviewDate, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
        weeklyOverviewDateTotalDurations.set(format(weeklyDate, weeklyDateFormat), 0)
        weeklyDate = addDays(weeklyDate, 1)
    }
    sessionDateTotalDurations.forEach((sessionDateTotalDuration) => {
        const key = format(
            parse(sessionDateTotalDuration.date, dateFormat, new Date()),
            weeklyDateFormat
        )

        if (!weeklyOverviewDateTotalDurations.has(key)) {
            return
        }

        weeklyOverviewDateTotalDurations.set(
            key,
            Number((sessionDateTotalDuration.totalDuration / 3600).toFixed(2))
        )
    })

    const weeklyTotalDurationSum = sessionDateTotalDurations
        .map(sessionDateTotalDuration => sessionDateTotalDuration.totalDuration)
        .reduce((previousValue, totalDuration) => previousValue + totalDuration, 0)

    return (
        <Stack>
            <Group justify={ "space-between" }>
                <Title order={ 2 } c={ "dimmed" }>Weekly</Title>

                <Group>
                    <DatePickerInput
                        value={ weeklyOverviewDate }
                        leftSection={ <IconCalendar size={ 18 }/> }
                        onChange={ (newDate) => {
                            if (newDate == null) {
                                return
                            }
                            setSearchParams((prev) => {
                                prev.set("weekly", format(newDate, dateFormat))
                                return prev
                            })
                        } }
                        maxDate={ new Date() }
                    />
                </Group>
            </Group>

            <Card py={ 32 } px={ 32 }>
                <Stack>
                    <Title c={ "dimmed" } order={ 5 } td={ "underline" }>GRAPH</Title>
                    <Center>
                        <LineChart
                            h={ 200 }
                            series={ [
                                { name: "Total Duration", color: "pink" }
                            ] }
                            dataKey={ "date" }
                            data={ Array.from(weeklyOverviewDateTotalDurations).map(([key, value]) => ({
                                date: key,
                                "Total Duration": value
                            })) }
                        />
                    </Center>

                    <Divider my={ 16 } />

                    <Stack>
                        <Stack>
                            <Title c={ "dimmed" } order={ 5 } td={ "underline" }>SUMMARY</Title>
                            <Text size={ "24px" }>
                                { `${ extractHours(weeklyTotalDurationSum) } hours and ${ extractMinutes(weeklyTotalDurationSum) } minutes` }
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
                </Stack>
            </Card>
        </Stack>
    )
}

export default DashboardWeeklyOverview
