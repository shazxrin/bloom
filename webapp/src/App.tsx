import {AppShell, MantineProvider, useMantineTheme} from "@mantine/core"
import "./App.css"
import {Notifications} from "@mantine/notifications"
import {useEffect, useState} from "react"
import {useTaskStore} from "./stores/taskStore.ts"
import {useCategoryStore} from "./stores/categoryStore.ts"
import AppNavBar from "./components/shell/AppNavbar.tsx"
import AppHeader from "./components/shell/AppHeader.tsx"
import Notifier from "./components/notification/Notifier.tsx"
import {Route, Switch} from "wouter"
import Timer from "./app/timer/Timer.tsx"
import History from "./app/history/History.tsx"
import {ModalsProvider} from "@mantine/modals"
import TaskFormModal from "./components/task/TaskFormModal.tsx"
import CategoryFormModal from "./components/category/CategoryFormModal.tsx"
import TaskDeleteModal from "./components/task/TaskDeleteModal.tsx"

export default function App() {
    const theme = useMantineTheme()
    const [isNavBarOpened, setIsNavBarOpened] = useState(false)

    const {
        fetchCurrentTask
    } = useTaskStore((state) => ({
        fetchCurrentTask: state.fetchCurrentTask,
    }))
    const {
        fetchCategories
    } = useCategoryStore((state) => ({
        fetchCategories: state.fetchCategories,
    }))

    useEffect(() => {
        fetchCategories()
        fetchCurrentTask()
    }, [])

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "dark",
                fontFamily: "DM Sans, san-serif",
                fontFamilyMonospace: "DM Mono, monospace"
            }}
        >
            <ModalsProvider modalProps={{centered: true}} modals={{
                "taskFormModal": TaskFormModal,
                "taskDeleteModal": TaskDeleteModal,
                "categoryFormModal": CategoryFormModal
            }} >
                <Notifications/>
                <AppShell
                    styles={{
                        main: {
                            background:theme.colors.dark[8]
                        },
                    }}
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    navbar={<AppNavBar isNavBarOpened={isNavBarOpened} closeNavBar={() => setIsNavBarOpened((o) => !o)}/>}
                    header={<AppHeader isNavBarOpened={isNavBarOpened} closeNavBar={() => setIsNavBarOpened((o) => !o)}/>}
                >
                    <Notifier/>
                    <Switch>
                        <Route path={"/timer"} component={Timer}/>
                        <Route path={"/history"} component={History}/>
                    </Switch>
                </AppShell>
            </ModalsProvider>
        </MantineProvider>
    )
}
