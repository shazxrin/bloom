import {Group, Navbar, Text, ThemeIcon, UnstyledButton, useMantineTheme,} from "@mantine/core"
import {Link} from "wouter"
import React from "react"
import {animated, useTransition} from "@react-spring/web"
import {IconHistory, IconHome, IconHourglass} from "@tabler/icons-react"
import useMobile from "../../hooks/useMobile.ts"

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

interface NavBarProps {
    isNavBarOpened: boolean
    closeNavBar: () => void
}

function NavBar({isNavBarOpened, closeNavBar}: NavBarProps) {
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

interface AppNavBarProps {
    isNavBarOpened: boolean
    closeNavBar: () => void
}

export default function AppNavBar({isNavBarOpened, closeNavBar}: AppNavBarProps) {
    const isMobile = useMobile()

    const transition = useTransition(isNavBarOpened, {
        config: {duration: 150},
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        exitBeforeEnter: true
    })

    return (
        <>
            {
                isMobile ?
                    transition((style, isNavBarOpened) => (
                        <animated.div style={style}>
                            <NavBar isNavBarOpened={isNavBarOpened} closeNavBar={closeNavBar}/>
                        </animated.div>
                    )) :
                    <NavBar isNavBarOpened={isNavBarOpened} closeNavBar={closeNavBar}/>
            }
        </>
    )
}
