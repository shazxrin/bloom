import useOverviewStore from "../../stores/overviewStore.ts"
import useMobile from "../../hooks/useMobile.ts"
import {
    ActionIcon,
    Box,
    Center,
    ColorSwatch,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core"
import {useEffect, useState} from "react"
import {DateTotalDurationDto} from "../../api/dto.ts"
import {addDays, addWeeks, format, isEqual, startOfWeek, subWeeks} from "date-fns"
import {ResponsiveLine} from "@nivo/line"
import {DatePickerInput} from "@mantine/dates"
import {
    formatDayOfWeek,
    formatDurationString,
    getTodayDate,
    parseDate
} from "../../utils/dateTimeUtils.ts"
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react"
import useCategoryStore from "../../stores/categoryStore.ts"
import {ResponsivePie} from "@nivo/pie"


function WeeklyOverviewPieChart() {
    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const {weeklyOverview} = useOverviewStore((state) => ({
        weeklyOverview: state.weeklyOverview,
    }))

    const theme = useMantineTheme()

    return (
        <Box h={200} w={200}>
            <ResponsivePie
                data={weeklyOverview.categories.map(categoryTotalDuration => ({
                    id: categoryTotalDuration.categoryId,
                    label: categories.find(c => c.id === categoryTotalDuration.categoryId)?.name ?? "Unknown",
                    value: categoryTotalDuration.totalDuration,
                    color: categories.find(c => c.id === categoryTotalDuration.categoryId)?.color ?? theme.colors.gray[9]
                }))}
                innerRadius={0.4}
                padAngle={2}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={pie => pie.data.color}
                isInteractive={false}
                enableArcLabels={false}
                enableArcLinkLabels={false}
            />
        </Box>
    )
}

function WeeklyOverviewSummary() {
    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const {weeklyOverview} = useOverviewStore((state) => ({
        weeklyOverview: state.weeklyOverview,
    }))

    const [sumTotalDuration, setSumTotalDuration] = useState(0)
    useEffect(() => {
        setSumTotalDuration(
            weeklyOverview
                .categories
                .map(categoryTotalDuration => categoryTotalDuration.totalDuration)
                .reduce((sum, totalDuration) => sum + totalDuration, 0)
        )
    }, [weeklyOverview])

    const theme = useMantineTheme()

    return (
        <Stack gap={"md"}>
            <Text c={theme.colors.gray[7]} fw={"bold"} size={"sm"}>
                SUMMARY
            </Text>

            <Text c={theme.colors.gray[4]} fw={"bold"} fz={32}>
                {formatDurationString(sumTotalDuration)}
            </Text>

            <Group gap={"xl"}>
                {weeklyOverview.categories.map(categoryTotalDuration => (
                    <Stack key={categoryTotalDuration.categoryId} gap={4}>
                        <Group gap={"xs"}>
                            <ColorSwatch size={16}
                                         color={categories.find(c => c.id === categoryTotalDuration.categoryId)?.color ?? theme.colors.gray[9]}/>
                            <Text c={theme.colors.gray[5]} fw={"bold"} size={"sm"} maw={150}
                                  truncate={"end"}>
                                {categories.find(c => c.id === categoryTotalDuration.categoryId)?.name ?? "Unknown"}
                            </Text>
                        </Group>
                        <Text c={theme.colors.gray[6]} size={"sm"}>
                            {formatDurationString(categoryTotalDuration.totalDuration)}
                        </Text>
                    </Stack>
                ))}
            </Group>
        </Stack>
    )
}

function WeeklyOverviewTitle() {
    const {weeklyOverviewDate, setWeeklyOverviewDate} = useOverviewStore((state) => ({
        weeklyOverviewDate: state.weeklyOverviewDate,
        setWeeklyOverviewDate: state.setWeeklyOverviewDate
    }))

    const theme = useMantineTheme()

    return (
        <Group justify={"space-between"}>
            <Title order={2} c={theme.colors.gray[5]}>Weekly Overview</Title>
            <Group gap={"xs"}>
                <DatePickerInput value={weeklyOverviewDate} onDateChange={setWeeklyOverviewDate}
                                 maxDate={getTodayDate()}/>
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
    )
}

function WeeklyOverviewLineChart() {
    const {weeklyOverview, weeklyOverviewDate} = useOverviewStore((state) => ({
        weeklyOverview: state.weeklyOverview,
        weeklyOverviewDate: state.weeklyOverviewDate,
    }))

    const [fullWeeklyOverview, setFullWeeklyOverview] = useState<DateTotalDurationDto[]>([])
    useEffect(() => {
        const firstDayOfWeek = startOfWeek(weeklyOverviewDate, {weekStartsOn: 1})
        const days = new Map<string, number>()
        const noOfDays = [...Array(7).keys()]
        noOfDays.forEach(v => {
            days.set(format(addDays(firstDayOfWeek, v), "yyyy-MM-dd"), 0)
        })

        weeklyOverview.dates.forEach(v => {
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
                colors={{datum: "color"}}
                theme={{
                    text: {
                        fontFamily: "DM Sans",
                        color: theme.colors.gray[6]
                    },
                }}
                enableArea={true}
                enableGridX={false}
                enableGridY={false}
                margin={{top: 40, right: 40, bottom: 40, left: 40}}/>
        </Box>
    )
}

export default function WeeklyOverview() {
    const isMobile = useMobile()
    const theme = useMantineTheme()

    return (
        <Stack>
            <WeeklyOverviewTitle/>

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
                <WeeklyOverviewLineChart/>
            </Paper>


            <Paper withBorder={true} p={32} bg={theme.colors.dark[8]}>
                {isMobile ?
                    <Stack>
                        <Center mb={16}>
                            <WeeklyOverviewPieChart />
                        </Center>
                        <WeeklyOverviewSummary />
                    </Stack> :
                    <Group grow={true}>
                        <WeeklyOverviewPieChart />
                        <WeeklyOverviewSummary />
                    </Group>
                }
            </Paper>

        </Stack>
    )
}
