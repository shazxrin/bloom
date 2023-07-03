import {useTaskStore} from "../../stores/taskStore.ts"
import {useCategoryStore} from "../../stores/categoryStore.ts"
import {useEffect} from "react"
import {notifications} from "@mantine/notifications"
import {IconCircleCheck, IconExclamationCircle} from "@tabler/icons-react"
import {useMantineTheme} from "@mantine/core"

export default function Notifier() {
    const theme = useMantineTheme()
    const iconColor = theme.colors.gray[9]

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
                title: "Action successful",
                message: taskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck color={iconColor}/>,
                color: "green",
                radius: "md"
            })
        }

        if (categoryStoreLoadedDetails) {
            notifications.show({
                title: "Action successful",
                message: categoryStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck color={iconColor}/>,
                color: "green",
                radius: "md"
            })
        }

        if (taskStoreErrorDetails) {
            notifications.show({
                title: "An error has occurred",
                message: taskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconExclamationCircle color={iconColor}/>,
                color: "red",
                radius: "md"
            })
        }

        if (categoryStoreErrorDetails) {
            notifications.show({
                title: "An error has occurred",
                message: categoryStoreErrorDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconExclamationCircle color={iconColor}/>,
                color: "red",
                radius: "md"
            })
        }
    }, [taskStoreLoadedDetails, taskStoreLoadedDetails, taskStoreErrorDetails, categoryStoreErrorDetails])

    return (<></>)
}
