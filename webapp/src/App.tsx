import {MantineProvider} from "@mantine/core"
import "./App.css"
import Root from "./app/Root.tsx"
import {Notifications} from "@mantine/notifications";

export default function App() {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "dark",
                fontFamily: "DM Sans, san-serif",
                fontFamilyMonospace: "DM Mono, monospace"
            }}>
            <Notifications/>
            <Root/>
        </MantineProvider>
    )
}
