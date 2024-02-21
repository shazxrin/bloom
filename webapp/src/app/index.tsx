import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { RouterProvider } from "react-router-dom"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import router from "~/app/router"
import "~/app/index.css"

const App = () => {
    return (
        <MantineProvider
            defaultColorScheme="dark"
            theme={{
                primaryColor: "pink",
                fontFamily: "DM Sans, san-serif",
                fontFamilyMonospace: "DM Mono, monospace"
            }}
        >
            <Notifications />
            
            <RouterProvider router={router} />
        </MantineProvider>
    )
}
export default App
