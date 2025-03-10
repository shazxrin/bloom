import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, } from "@remix-run/react"
import {
    ActionIcon,
    Affix,
    AppShell,
    Center,
    ColorSchemeScript,
    Container,
    Divider,
    Image,
    Loader,
    MantineProvider, rem,
    ScrollArea,
    Stack,
} from "@mantine/core"
import { NavigationProgress, nprogress } from "@mantine/nprogress"
import React, { useEffect } from "react"
import {
    IconDashboard,
    IconHistory,
    IconHourglassEmpty,
    IconMenu2,
    IconTags,
    IconTimeline,
    IconX
} from "@tabler/icons-react"
import RootNavButton from "~/components/root/root-nav-button"
import RootSectionNavButton from "~/components/root/root-section-nav-button"
import "@mantine/core/styles.css"
import "@mantine/nprogress/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/charts/styles.css"
import "~/styles/fonts.css"
import { Notifications } from "@mantine/notifications"
import { AnimatePresence } from "framer-motion"
import AnimatePage from "~/components/animation/animate-page"
import { useToggle } from "@mantine/hooks"

export function meta() {
    return [
        { title: "Bloom" },
        { name: "description", content: "Personal time tracking app" },
    ]
}

export function Layout({ children }: { children: React.ReactNode }) {
    const navigation = useNavigation()
    useEffect(() => {
        console.log(navigation.state)
        if (navigation.state != "idle") {
            nprogress.start()
        } else {
            nprogress.complete()
        }
    }, [navigation.state])

    const [isMobileNavBarCollapsed, toggleIsMobileNavBarCollapsed] = useToggle([true, false])

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
            <ColorSchemeScript forceColorScheme={ "dark" }/>
        </head>
        <body>
        <MantineProvider
            forceColorScheme="dark"
            theme={ {
                primaryColor: "pink",
                fontFamily: "DM Sans, sans-serif",
                fontFamilyMonospace: "DM Mono, monospace",
                fontSizes: {
                    xs: rem(11),
                    sm: rem(12),
                    md: rem(14),
                    lg: rem(16),
                    xl: rem(18),
                },
                headings: {
                    sizes: {
                        h1: { fontSize: rem(28) },
                        h2: { fontSize: rem(24) },
                        h3: { fontSize: rem(18) },
                        h4: { fontSize: rem(16) },
                        h5: { fontSize: rem(14) },
                        h6: { fontSize: rem(12) },
                    }
                }
            } }
        >
            <AppShell
                h="100vh"
                navbar={ { width: 320, breakpoint: "sm", collapsed: { mobile: isMobileNavBarCollapsed } } }
                padding="md"
            >
                <AppShell.Navbar p="md" bg={ "dark" }>
                    <AppShell.Section mx={ 8 } my={ 16 }>
                        <Image
                            src="/bloom_full.svg"
                            alt="Bloom Logo"
                            w={ "auto" }
                            h={ 32 }
                        />
                    </AppShell.Section>

                    <Divider my={4} />

                    <AppShell.Section grow my="md" component={ ScrollArea }>
                        <Stack gap={ 4 }>
                            <RootNavButton
                                to="/"
                                icon={ <IconDashboard size={ 20 }/> }
                                label="Dashboard"
                                onClick={ () => toggleIsMobileNavBarCollapsed() }
                            />
                            <RootSectionNavButton label={ "Session" } icon={ <IconTimeline size={ 20 }/> }>
                                <RootNavButton
                                    to="/session/timer"
                                    icon={ <IconHourglassEmpty size={ 20 }/> }
                                    label="Timer"
                                    onClick={ () => toggleIsMobileNavBarCollapsed() }
                                />
                                <RootNavButton
                                    to="/session/tags"
                                    icon={ <IconTags size={ 20 }/> }
                                    label="Tags"
                                    onClick={ () => toggleIsMobileNavBarCollapsed() }
                                />
                                <RootNavButton
                                    to="/session/history"
                                    icon={ <IconHistory size={ 20 }/> }
                                    label="History"
                                    onClick={ () => toggleIsMobileNavBarCollapsed() }
                                />
                            </RootSectionNavButton>
                        </Stack>
                    </AppShell.Section>
                </AppShell.Navbar>

                <AppShell.Main h="100%">
                    <NavigationProgress/>

                    <Affix position={ { top: 32, right: 0 } } hiddenFrom={ "sm" }>
                        <ActionIcon
                            size={ "xl" }
                            variant={ "default" }
                            onClick={ () => toggleIsMobileNavBarCollapsed() }
                            opacity={ 0.6 }
                            radius={ 0 }
                        >
                            { isMobileNavBarCollapsed ? <IconMenu2 size={ 24 }/> : <IconX size={ 24 }/> }
                        </ActionIcon>
                    </Affix>

                    <Container size="lg" h="100%">
                        { children }
                    </Container>

                    <Notifications position={ "top-right" }/>
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    )
}

export function HydrateFallback() {
    return (
        <Center w={ "100%" } h={ "100%" }>
            <Loader/>
        </Center>
    )
}

export default function App() {
    return (
        <AnimatePresence>
            <AnimatePage>
                <Outlet/>
            </AnimatePage>
        </AnimatePresence>
    )
}
