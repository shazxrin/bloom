import {useTaskStore} from "../../stores/taskStore.ts"
import {useCategoryStore} from "../../stores/categoryStore.ts"
import {useEffect} from "react"
import {notifications} from "@mantine/notifications"
import {IconCircleCheck, IconCircleX} from "@tabler/icons-react"

export default function Notifier() {
    const {
        loadedDetails: taskStoreLoadedDetails,
        errorDetails: taskStoreErrorDetails
    } = useTaskStore((state) => ({
        loadedDetails: state.loadedDetails,
        errorDetails: state.errorDetails,
    }))
    const {
        loadedDetails: categoryStoreLoadedDetails,
        errorDetails: categoryStoreErrorDetails
    } = useCategoryStore((state) => ({
        loadedDetails: state.loadedDetails,
        errorDetails: state.errorDetails,
    }))

    useEffect(() => {
        if (taskStoreLoadedDetails) {
            notifications.show({
                title: "Success",
                message: taskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck />,
                color: "green",
                radius: "md"
            })
        }

        if (categoryStoreLoadedDetails) {
            notifications.show({
                title: "Success",
                message: categoryStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck />,
                color: "green",
                radius: "md"
            })
        }

        if (taskStoreErrorDetails) {
            notifications.show({
                title: "Error",
                message: taskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleX />,
                color: "red",
                radius: "md"
            })
        }

        if (categoryStoreErrorDetails) {
            notifications.show({
                title: "Error",
                message: categoryStoreErrorDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleX />,
                color: "red",
                radius: "md"
            })
        }
    }, [taskStoreLoadedDetails, taskStoreLoadedDetails, taskStoreErrorDetails, categoryStoreErrorDetails])

    return (<></>)
}
