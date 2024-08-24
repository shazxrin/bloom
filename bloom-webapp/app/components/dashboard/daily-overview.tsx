import { ActionIcon, Box, Card, Center, ColorSwatch, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar, IconChevronLeft, IconChevronRight, IconMoodPuzzled } from "@tabler/icons-react"
import { addDays, format, isAfter, parse } from "date-fns"
import { PieChart } from "@mantine/charts"
import { extractHours, extractMinutes } from "~/utils/duration"
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

    const theme = useMantineTheme()

    return (
        <Stack>
            <Group justify={ "space-between" }>
                <Title order={ 2 } c={ "dimmed" }>Daily</Title>

                <Group gap={ "sm" } align={ "center" }>
                    <ActionIcon
                        size={ "lg" }
                        variant={ "default" }
                        c={ "gray.6" }
                        onClick={ () => {
                            const newDailyOverviewDate = addDays(dailyOverviewDate, -1)

                            setSearchParams((prev) => {
                                prev.set("daily", format(newDailyOverviewDate, dateFormat))
                                return prev
                            })
                        } }
                    >
                        <IconChevronLeft size={ 18 }/>
                    </ActionIcon>

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

                    <ActionIcon
                        size={ "lg" }
                        variant={ "default" }
                        c={ "gray.6" }
                        onClick={ () => {
                            const newDailyOverviewDate = addDays(dailyOverviewDate, 1)
                            if (isAfter(newDailyOverviewDate, new Date())) {
                                return
                            }

                            setSearchParams((prev) => {
                                prev.set("daily", format(newDailyOverviewDate, dateFormat))
                                return prev
                            })
                        } }
                        disabled={ isAfter(addDays(dailyOverviewDate, 1), new Date()) }
                    >
                        <IconChevronRight size={ 18 }/>
                    </ActionIcon>
                </Group>
            </Group>

            <Card py={ 32 } px={ 32 }>
                <Group align={ "start" }>
                        <Group gap={ 0 } justify={ "space-between" }>
                            <Stack>
                                <Title c={ "dimmed" } order={ 5 } td={ "underline" }>CHART</Title>

                                <Center>
                                    {
                                        sessionTagTotalDurations.length === 0
                                            ? <Box p={ 32 }>
                                                <IconMoodPuzzled size={ 160 } strokeWidth={ 1.25 } color={ theme.colors.pink[7] } />
                                            </Box>
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
                                        ? <Text size={ "sm" } c={ "dimmed" }> No sessions created</Text>
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
                </Group>
            </Card>
        </Stack>
    )
}

export default DashboardDailyOverview
