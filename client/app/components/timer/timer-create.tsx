import TimerCreateModal from "~/components/timer/timer-create-modal"
import { Button, Center, Stack, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconMoodPuzzled, IconSparkles } from "@tabler/icons-react"

type TimerCreateProps = {
    tags: {
        id: string
        name: string
        color: string
    }[]
}

const TimerCreate = ({ tags }: TimerCreateProps) => {
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Center h="100%" w="100%">
                <Stack gap={ 24 } align="center">
                    <IconMoodPuzzled size={ 96 }/>
                    <Title order={ 4 }>No session in progress</Title>

                    <Button leftSection={ <IconSparkles size={ 20 }/> } onClick={ open }>
                        Create session
                    </Button>
                </Stack>
            </Center>

            <TimerCreateModal opened={ opened } close={ close } tags={ tags }/>
        </>
    )
}

export default TimerCreate
