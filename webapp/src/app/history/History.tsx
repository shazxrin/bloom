import {Stack, Title} from "@mantine/core"
import HistoryTaskTable from "../../components/history/HistoryTaskTable.tsx"
import useMobile from "../../hooks/useMobile.ts"

export default function History() {
    const isMobile = useMobile()

    return (
        <Stack w={"100%"} h={"100%"} px={isMobile ? 4 : 16} py={16}>
            <Title order={1} mb={16}>History</Title>
            <HistoryTaskTable />
        </Stack>
    )
}