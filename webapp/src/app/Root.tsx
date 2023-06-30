import {useEffect, useState} from 'react'
import {
    AppShell,
    Header,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
} from '@mantine/core'
import AppNavBar from '../components/AppNavbar.tsx'
import Timer from "./timer/Timer.tsx"
import {useTaskStore} from "../stores/taskStore.ts";
import {useCategoryStore} from "../stores/categoryStore.ts";
import History from "./history/History.tsx";
import {Route, Switch} from "wouter";

export default function Root() {
    const theme = useMantineTheme()
    const [opened, setOpened] = useState(false)

    const {fetchCurrentTask} = useTaskStore((state) => ({
        fetchCurrentTask: state.fetchCurrentTask
    }))
    const {fetchCategories} = useCategoryStore((state) => ({
        fetchCategories: state.fetchCategories
    }))
    useEffect(() => {
       fetchCategories()
       fetchCurrentTask()
    }, [])

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<AppNavBar opened={opened}/>}
            header={
                <Header height={{base: 60}} p="md">
                    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <Text size={"lg"} weight={"bold"}>bloom</Text>
                    </div>
                </Header>
            }
        >
            <Switch>
                <Route path={"/timer"} component={Timer} />
                <Route path={"/history"} component={History} />
            </Switch>
        </AppShell>
    )
}