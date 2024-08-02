import React from "react";
import { Badge, Card, Group, Stack, Title, useMantineTheme } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { format } from "date-fns";

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
    const dateTotalDurationMap = new Map(
        sessionDateTotalDurations.map(session => [session.date, session.totalDuration])
    )

    return (
        <Stack>
            <Title order={ 2 } c={ "dimmed" }>Yearly</Title>

            <Card py={ 32 } px={ 32 }>
                <Group justify={ "center" } align={ "start" }>
                    {
                        [...Array(12).keys()].map(value => (
                            <Calendar
                                key={ value }
                                static={ true }
                                hideOutsideDates={ true }
                                date={ new Date(2024, value) }
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
