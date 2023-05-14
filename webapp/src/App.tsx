import { MantineProvider } from "@mantine/core";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root.tsx";
import Timer, {timerAction, timerLoader} from "./routes/Timer.tsx";
import "./App.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "/timer",
				element: <Timer />,
				loader: timerLoader,
				action: timerAction
			},
		],
	},
]);

export default function App() {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				fontFamily: "Inter, san-serif",
			}}
		>
			<RouterProvider router={router} />
		</MantineProvider>
	);
}
