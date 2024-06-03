import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, } from "@remix-run/react"
import { MetaFunction } from "@remix-run/node"
import {
    AppShell,
    Center,
    ColorSchemeScript,
    Container,
    Divider,
    Image,
    Loader,
    MantineProvider,
    ScrollArea,
    Stack,
} from "@mantine/core"
import { NavigationProgress, nprogress } from "@mantine/nprogress"
import React, { useEffect } from "react"
import { IconDashboard, IconHistory, IconHourglassEmpty, IconTags, IconTimeline } from "@tabler/icons-react"
import RootNavButton from "~/components/root/root-nav-button"
import RootSectionNavButton from "~/components/root/root-section-nav-button"
import "@mantine/core/styles.css"
import "@mantine/nprogress/styles.css"
import "@mantine/notifications/styles.css"
import "~/styles/fonts.css"
import { Notifications } from "@mantine/notifications"
import { AnimatePresence } from "framer-motion"
import AnimatePage from "~/components/animation/animate-page"

const meta: MetaFunction = () => {
    return [
        { title: "Bloom" },
        { name: "description", content: "Personal time tracking app" },
    ]
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigation = useNavigation()
    useEffect(() => {
        console.log(navigation.state)
        if (navigation.state != "idle") {
            nprogress.start()
        } else {
            nprogress.complete()
        }
    }, [navigation.state])

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
            } }
        >
            <AppShell
                h="100vh"
                navbar={ { width: 320, breakpoint: "sm" } }
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

                    <Divider/>

                    <AppShell.Section grow my="md" component={ ScrollArea }>
                        <Stack gap={ 4 }>
                            <RootNavButton to="/" icon={ <IconDashboard size={ 20 }/> } label="Dashboard"/>
                            <RootSectionNavButton label={ "Session" } icon={ <IconTimeline size={ 20 }/> }>
                                <RootNavButton to="/timer" icon={ <IconHourglassEmpty size={ 20 }/> } label="Timer"/>
                                <RootNavButton to="/tags" icon={ <IconTags size={ 20 }/> } label="Tags"/>
                                <RootNavButton to="/history" icon={ <IconHistory size={ 20 }/> } label="History"/>
                            </RootSectionNavButton>
                        </Stack>
                    </AppShell.Section>
                </AppShell.Navbar>

                <AppShell.Main h="100%">
                    <NavigationProgress/>
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

const HydrateFallback = () => {
    return (
        <Center w={ "100%" } h={ "100%" }>
            <Loader/>
        </Center>
    )
}

const App = () => {
    return (
        <AnimatePresence>
            <AnimatePage>
                <Outlet />
            </AnimatePage>
        </AnimatePresence>
    )
}

export {
    meta,
    Layout,
    HydrateFallback,
}
export default App
