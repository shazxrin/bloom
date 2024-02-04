import {Burger, Header, MediaQuery, Image, useMantineTheme, Group, ActionIcon} from "@mantine/core"
import LoadingIndicator from "../loading/LoadingIndicator.tsx"
import {IconRefresh} from "@tabler/icons-react"
import useShellStore from "../../stores/shellStore.ts"

interface AppHeaderProps {
    isNavBarOpened: boolean
    closeNavBar: () => void
}

export default function AppHeader({isNavBarOpened, closeNavBar}: AppHeaderProps) {
    const {refresh} = useShellStore((state) => ({
        refresh: state.refresh
    }))

    const theme = useMantineTheme()

    return (
        <Header height={{base: 60}} p="md" sx={{
            backgroundColor: theme.colors.dark[8]
        }}>
            <Group position={"apart"}>
                <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                    <MediaQuery largerThan="sm" styles={{display: "none"}}>
                        <Burger
                            opened={isNavBarOpened}
                            onClick={closeNavBar}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                        />
                    </MediaQuery>

                    <Image maw={100} src={"/bloom_full.svg"} />
                </div>
                <Group>
                    <Group>
                        <ActionIcon size={"md"} variant={"light"} onClick={refresh}>
                            <IconRefresh color={theme.colors.gray[5]} size={20} />
                        </ActionIcon>
                    </Group>
                    <LoadingIndicator />
                </Group>
            </Group>
        </Header>
    )
}