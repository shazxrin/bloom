import {Stack, Title} from "@mantine/core"
import HistoryTaskTable from "../../components/history/HistoryTaskTable.tsx"
import useMobile from "../../hooks/useMobile.ts"

export default function History() {
    const isMobile = useMobile()

    return (
        <Stack w={"100%"} h={"100%"} maw={960} mx={"auto"} px={isMobile ? 4 : 16} pt={32}>
            <Title order={1} mb={16}>History</Title>
            <HistoryTaskTable />
        </Stack>
    )
}