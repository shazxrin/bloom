import {Burger, Header, MediaQuery, Image, useMantineTheme} from "@mantine/core"

interface AppHeaderProps {
    isNavBarOpened: boolean
    closeNavBar: () => void
}

export default function AppHeader({isNavBarOpened, closeNavBar}: AppHeaderProps) {
    const theme = useMantineTheme()

    return (
        <Header height={{base: 60}} p="md">
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
        </Header>
    )
}