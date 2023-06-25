import {MantineProvider} from "@mantine/core"
import "./App.css"
import Root from "./app/Root.tsx"

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
            <Root/>
        </MantineProvider>
    )
}
