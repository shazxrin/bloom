import useOverviewStore from "../../stores/overviewStore.ts"
import useMobile from "../../hooks/useMobile.ts"
import {ActionIcon, Box, Group, Paper, Stack, Title, useMantineTheme} from "@mantine/core"
import {useEffect, useState} from "react"
import {DateTotalDurationDto} from "../../api/dto.ts"
import {addDays, addWeeks, format, isEqual, startOfWeek, subWeeks} from "date-fns"
import {ResponsiveLine} from "@nivo/line"
import {DatePickerInput} from "@mantine/dates"
import {formatDayOfWeek, getTodayDate, parseDate} from "../../utils/dateTimeUtils.ts"
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react"

export default function WeeklyOverview() {
    const {weeklyOverview, weeklyOverviewDate, setWeeklyOverviewDate} = useOverviewStore((state) => ({
        weeklyOverview: state.weeklyOverview,
        weeklyOverviewDate: state.weeklyOverviewDate,
        setWeeklyOverviewDate: state.setWeeklyOverviewDate
    }))

    const [fullWeeklyOverview, setFullWeeklyOverview] = useState<DateTotalDurationDto[]>([])
    useEffect(() => {
        const firstDayOfWeek = startOfWeek(weeklyOverviewDate, {weekStartsOn: 1})
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
    }, [weeklyOverviewDate, weeklyOverview])

    const isMobile = useMobile()

    const theme = useMantineTheme()

    return (
        <Stack>
            <Group position={"apart"}>
                <Title order={2} color={theme.colors.gray[5]}>Weekly</Title>
                <Group spacing={"xs"}>
                    <DatePickerInput value={weeklyOverviewDate} onChange={setWeeklyOverviewDate} maxDate={getTodayDate()}/>
                    <ActionIcon
                        size={"lg"}
                        variant={"light"}
                        onClick={() => {
                            const newOverviewDate = startOfWeek(subWeeks(weeklyOverviewDate, 1), {weekStartsOn: 1})
                            setWeeklyOverviewDate(newOverviewDate)
                        }}
                    >
                        <IconArrowLeft size={20}/>
                    </ActionIcon>
                    <ActionIcon
                        size={"lg"}
                        variant={"light"}
                        disabled={isEqual(startOfWeek(getTodayDate(), {weekStartsOn: 1}), startOfWeek(weeklyOverviewDate, {weekStartsOn: 1}))}
                        onClick={() => {
                            const newOverviewDate = startOfWeek(addWeeks(weeklyOverviewDate, 1), {weekStartsOn: 1})
                            setWeeklyOverviewDate(newOverviewDate)
                        }}
                    >
                        <IconArrowRight size={20}/>
                    </ActionIcon>
                </Group>
            </Group>

            <Paper
                withBorder={true}
                px={16}
                py={isMobile ? 4 : 16}
                bg={theme.colors.dark[8]}
               style={{
                   overflowX: "auto",
                   overflowY: "hidden"
               }}
            >
                <Box h={360} w={isMobile ? 640 : "100%"}>
                    <ResponsiveLine
                        data={[{
                            id: "default",
                            color: theme.colors.pink[4],
                            data: fullWeeklyOverview.map(dateTotalDuration => ({
                                x: formatDayOfWeek(parseDate(dateTotalDuration.date)),
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
