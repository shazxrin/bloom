import {ResponsivePie} from "@nivo/pie"
import useOverviewStore from "../../stores/overviewStore.ts"
import {
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
import useCategoryStore from "../../stores/categoryStore.ts"
import {useEffect, useState} from "react"
import useMobile from "../../hooks/useMobile.ts"
import {formatDurationString} from "../../utils/dateTimeUtils.ts"

function DailyOverviewPieChart() {
    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const {dailyOverview} = useOverviewStore((state) => ({
        dailyOverview: state.dailyOverview
    }))

    const theme = useMantineTheme()

    return (
        <Box h={200} w={200}>
            <ResponsivePie
                data={dailyOverview.map(categoryTotalDuration => ({
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

function DailyOverviewSummary() {
    const {categories} = useCategoryStore((state) => ({
        categories: state.categories
    }))

    const {dailyOverview} = useOverviewStore((state) => ({
        dailyOverview: state.dailyOverview
    }))

    const [sumTotalDuration, setSumTotalDuration] = useState(0)
    useEffect(() => {
        setSumTotalDuration(
            dailyOverview
                .map(categoryTotalDuration => categoryTotalDuration.totalDuration)
                .reduce((sum, totalDuration) => sum + totalDuration, 0)
        )
    }, [dailyOverview])

    const theme = useMantineTheme()

    return (
        <Stack spacing={"md"}>
            <Text color={theme.colors.gray[7]} weight={"bold"} size={"sm"}>
                SUMMARY
            </Text>

            <Text color={theme.colors.gray[4]} weight={"bold"} size={32}>
                {formatDurationString(sumTotalDuration)}
            </Text>

            <Group spacing={"xl"}>
                {dailyOverview.map(categoryTotalDuration => (
                    <Stack key={categoryTotalDuration.categoryId} spacing={4}>
                        <Group spacing={"xs"}>
                            <ColorSwatch size={16}
                                         color={categories.find(c => c.id === categoryTotalDuration.categoryId)?.color ?? theme.colors.gray[9]}/>
                            <Text color={theme.colors.gray[5]} weight={"bold"} size={"sm"}>
                                {categories.find(c => c.id === categoryTotalDuration.categoryId)?.name ?? "Unknown"}
                            </Text>
                        </Group>
                        <Text color={theme.colors.gray[6]} size={"sm"}>
                            {formatDurationString(categoryTotalDuration.totalDuration)}
                        </Text>
                    </Stack>
                ))}
            </Group>
        </Stack>
    )
}

export default function DailyOverview() {
    const isMobile = useMobile()
    const theme = useMantineTheme()

    return (
        <Stack>
            <Title order={2} color={theme.colors.gray[5]}>Today</Title>

            <Paper withBorder={true} p={32} bg={theme.colors.dark[8]}>
                {isMobile ?
                    <Stack>
                        <Center mb={16}>
                            <DailyOverviewPieChart />
                        </Center>
                        <DailyOverviewSummary />
                    </Stack> :
                    <Group grow={true}>
                        <DailyOverviewPieChart />
                        <DailyOverviewSummary />
                    </Group>
                }
            </Paper>
        </Stack>
    )
}