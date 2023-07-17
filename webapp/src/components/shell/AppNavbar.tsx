import {
    Group,
    Navbar,
    ThemeIcon,
    UnstyledButton,
    Text,
    useMantineTheme,
} from "@mantine/core"
import {IconHourglass, IconHistory, IconHome} from "@tabler/icons-react"
import {Link} from "wouter"
import React from "react"

interface MainLinkProps {
    icon: React.ReactNode
    color: string
    label: string
    link: string
    onClick: () => void
}

function MainLink({icon, color, label, link, onClick}: MainLinkProps) {
    return (
        <Link to={link} style={{textDecoration: 'none'}} onClick={onClick}>
            <UnstyledButton
                sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colors.dark[0],
                    "&:hover": {
                        backgroundColor: theme.colors.dark[6]
                    },
                })}
            >
                <Group>
                    <ThemeIcon color={color} variant="filled">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{label}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    )
}

interface AppNavBarProps {
    isNavBarOpened: boolean
    closeNavBar: () => void
}

export default function AppNavBar({isNavBarOpened, closeNavBar}: AppNavBarProps) {
    const theme = useMantineTheme()

    const backgroundColor = theme.colors.pink[5]
    const iconSize = 18
    const iconColor = theme.colors.gray[9]

    return (
        <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!isNavBarOpened}
            width={{sm: 200, lg: 300}}
        >
            <MainLink
                icon={<IconHome color={iconColor} size={iconSize}/>}
                color={backgroundColor}
                label="Overview"
                link="/"
                onClick={closeNavBar}
            />
            <MainLink
                icon={<IconHourglass color={iconColor} size={iconSize}/>}
                color={backgroundColor}
                label="Timer"
                link="/timer"
                onClick={closeNavBar}
            />
            <MainLink
                icon={<IconHistory color={iconColor} size={iconSize}/>}
                color={backgroundColor}
                label="History"
                link="/history"
                onClick={closeNavBar}
            />
        </Navbar>
    )
}
