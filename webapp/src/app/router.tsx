import { createBrowserRouter } from "react-router-dom"
import RootPage from "~/app/root/page"
import Dashboard from "~/app/dashboard/Dashboard"
import Timer from "~/app/timer/Timer"
import History from "~/app/history/History"

const router = createBrowserRouter([{
    path: "/",
    element: <RootPage />,
    children: [
        {
            index: true,
            element: <Dashboard />
        },
        {
            path: "/timer",
            element: <Timer />
        },
        {
            path: "/history",
            element: <History />
        }
    ]
}])
export default router
