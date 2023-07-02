import {Stack, Title} from "@mantine/core"
import HistoryTaskTable from "../../components/history/HistoryTaskTable.tsx"

export default function History() {
    return (
        <Stack w={"100%"} h={"100%"} p={16}>
            <Title order={1} mb={16}>History</Title>
            <HistoryTaskTable />
        </Stack>
    )
}