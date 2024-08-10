import { Badge, Card, Group, Stack, Title } from "@mantine/core";
import { Calendar, YearPickerInput } from "@mantine/dates";
import { format, parse } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";
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

const DashboardYearlyOverview = ({ sessionDateTotalDurations }: DashboardYearlyOverviewProps) => {
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

                <Group>
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
                </Group>
            </Group>

            <Card py={ 32 } px={ 32 }>
                <Group justify={ "center" } align={ "start" }>
                    {
                        [...Array(12).keys()].map(value => (
                            <Calendar
                                key={ value }
                                static={ true }
                                hideOutsideDates={ true }
                                date={ new Date(yearlyOverviewDate.getFullYear(), value) }
                                size={ "xs" }
                                renderDay={
                                    (date) => {
                                        const dateStr = format(date, dateFormat)

                                        const duration = dateTotalDurationMap.get(dateStr) ?? 0
                                        const colorIdx = Math.floor(
                                            Math.min(duration / (60 * 60 * maxHours), 1) * 9
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

export default DashboardYearlyOverview
