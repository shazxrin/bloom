import { ActionIcon, AppShell, Burger, Group, Image, MantineProvider, ScrollArea, Stack } from "@mantine/core"
import "./App.css"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { Notifications } from "@mantine/notifications"
import Notifier from "./components/notification/Notifier.tsx"
import { Route, Switch, useLocation } from "wouter"
import Timer from "./app/timer/Timer.tsx"
import History from "./app/history/History.tsx"
import { ModalsProvider } from "@mantine/modals"
import TaskFormModal from "./components/task/TaskFormModal.tsx"
import CategoryFormModal from "./components/category/CategoryFormModal.tsx"
import TaskDeleteModal from "./components/task/TaskDeleteModal.tsx"
import { animated, useTransition } from "@react-spring/web"
import CategoryManageModal from "./components/category/CategoryManageModal.tsx"
import AppShellNavButton from "~/components/shell/AppShellNavButton.tsx"
import { IconClock, IconHistory, IconLayoutDashboard, IconRefresh } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import Dashboard from "~/app/dashboard/Dashboard.tsx"
import useShellStore from "~/stores/shellStore.ts"

export default function App() {
    const { refresh } = useShellStore((state) => ({
        refresh: state.refresh
    }))
    const [opened, { toggle }] = useDisclosure();

    const [location] = useLocation()

    const transition = useTransition(location, {
        config: { duration: 150 },
        from: { opacity: 0, width: "100%", height: "100%" },
        enter: { opacity: 1, width: "100%", height: "100%" },
        leave: { opacity: 0, width: "100%", height: "100%" },
        exitBeforeEnter: true
    })

    return (
        <MantineProvider
            defaultColorScheme="dark"
            theme={{
                primaryColor: "pink",
                fontFamily: "DM Sans, san-serif",
                fontFamilyMonospace: "DM Mono, monospace"
            }}
        >
            <ModalsProvider modalProps={{ centered: true }} modals={{
                "taskFormModal": TaskFormModal,
                "taskDeleteModal": TaskDeleteModal,
                "categoryFormModal": CategoryFormModal,
                "categoryManageModal": CategoryManageModal
            }}>
                <Notifications />

                <AppShell
                    h="100vh"
                    header={{ height: 60 }}
                    navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
                >
                    <AppShell.Header px="lg" py="md">
                        <Group align="center" justify="space-between">
                            <Group>
                                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                                <Image maw={100} src={"/bloom_full.svg"} />
                            </Group>

                            <ActionIcon onClick={refresh} size="lg" c="gray" variant="subtle">
                                <IconRefresh size={18} />
                            </ActionIcon>
                        </Group>
                    </AppShell.Header>

                    <AppShell.Navbar p="md">
                        <AppShell.Section grow component={ScrollArea}>
                            <Stack gap={4}>
                                <AppShellNavButton
                                    icon={<IconLayoutDashboard size={18} />}
                                    label="Dashboard"
                                    link="/"
                                />
                                <AppShellNavButton
                                    icon={<IconClock size={18} />}
                                    label="Timer"
                                    link="/timer"
                                />
                                <AppShellNavButton
                                    icon={<IconHistory size={18} />}
                                    label="History"
                                    link="/history"
                                />
                            </Stack>
                        </AppShell.Section>
                    </AppShell.Navbar>

                    <Notifier />

                    <AppShell.Main w={"100%"} h={"100%"}>
                        {transition((style, location) => (
                            <animated.div style={style}>
                                <Switch location={location}>
                                    <Route path={"/"} component={Dashboard} />
                                    <Route path={"/timer"} component={Timer} />
                                    <Route path={"/history"} component={History} />
                                </Switch>
                            </animated.div>
                        ))}
                    </AppShell.Main>
                </AppShell>
            </ModalsProvider>
        </MantineProvider>
    )
}
