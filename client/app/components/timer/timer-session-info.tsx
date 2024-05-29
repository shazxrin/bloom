import { Stack, Badge, Text } from "@mantine/core"

type TimerSessionInfoProps = {
    name: string
    tag: {
        name: string
        color: string
    }
}

const TimerSessionInfo = ({ name, tag }: TimerSessionInfoProps) => {
    return (
        <Stack gap={ 8 } align="center" maw={ 250 }>
            <Badge radius="xs" size="lg" autoContrast style={ { backgroundColor: tag.color } }>{ tag.name }</Badge>

            <Text ta="center" w="100%" truncate>{ name }</Text>
        </Stack>
    )
}

export default TimerSessionInfo
