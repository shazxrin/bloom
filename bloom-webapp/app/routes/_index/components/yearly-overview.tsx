import { ActionIcon, Badge, Card, Group, Stack, Title } from "@mantine/core";
import { Calendar, YearPickerInput } from "@mantine/dates";
import { addYears, format, isAfter, parse } from "date-fns";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSearchParams } from "@remix-run/react";

const yearFormat = "yyyy"
const dateFormat = "yyyy-MM-dd"
const dayFormat = "d"
const maxHours = 6

type DashboardYearlyOverviewProps = {
    sessionDateTotalDurations: {
        date: string,
        totalDuration: number
    }[]
}

export default function DashboardYearlyOverview({ sessionDateTotalDurations }: DashboardYearlyOverviewProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const yearlyOverviewYearStr = searchParams.get("yearly")
    const yearlyOverviewDate = yearlyOverviewYearStr
                               ? parse(yearlyOverviewYearStr, yearFormat, new Date())
                               : new Date()

    const dateTotalDurationMap = new Map(
        sessionDateTotalDurations.map(session => [session.date, session.totalDuration])
    )

    return (
        <Stack>
            <Group justify={ "space-between" }>
                <Title order={ 2 } c={ "dimmed" }>Yearly</Title>

                <Group gap={ "sm" } align={ "center" }>
                    <ActionIcon
                        size={ "lg" }
                        variant={ "default" }
                        c={ "gray.6" }
                        onClick={ () => {
                            const newYearlyOverviewDate = addYears(yearlyOverviewDate, -1)

                            setSearchParams((prev) => {
                                prev.set("yearly", format(newYearlyOverviewDate, yearFormat))
                                return prev
                            })
                        } }
                    >
                        <IconChevronLeft size={ 18 }/>
                    </ActionIcon>

                    <YearPickerInput
                        value={ yearlyOverviewDate }
                        leftSection={ <IconCalendar size={ 18 }/> }
                        onChange={ (newDate) => {
                            if (newDate == null) {
                                return
                            }
                            setSearchParams((prev) => {
                                prev.set("yearly", format(newDate, yearFormat))
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
                            const newYearlyOverviewDate = addYears(yearlyOverviewDate, 1)
                            if (isAfter(newYearlyOverviewDate, new Date())) {
                                return
                            }

                            setSearchParams((prev) => {
                                prev.set("yearly", format(newYearlyOverviewDate, yearFormat))
                                return prev
                            })
                        } }
                        disabled={ isAfter(addYears(yearlyOverviewDate, 1), new Date()) }
                    >
                        <IconChevronRight size={ 18 }/>
                    </ActionIcon>
                </Group>
            </Group>

            <Card py={ 32 } px={ 32 }>
                <Group justify={ "center" } align={ "start" }>
                    {
                        [...Array(12).keys()].map(value => (
                            <Calendar
                                key={ value }
                                maxLevel={ "month" }
                                static={ true }
                                hideOutsideDates={ true }
                                date={ new Date(yearlyOverviewDate.getFullYear(), value) }
                                size={ "xs" }
                                renderDay={
                                    (date) => {
                                        const dateStr = format(date, dateFormat)

                                        const duration = dateTotalDurationMap.get(dateStr) ?? 0
                                        const colorIdx = Math.floor(
                                            Math.min(duration / (
                                                60 * 60 * maxHours
                                            ), 1) * 9
                                        )

                                        return (
                                            <Badge
                                                size="lg"
                                                autoContrast={ true }
                                                circle={ true }
                                                color={ `pink.${ colorIdx }` }
                                            >
                                                { format(date, dayFormat) }
                                            </Badge>
                                        )
                                    }
                                }
                            />
                        ))
                    }
                </Group>
            </Card>
        </Stack>
    )
}
