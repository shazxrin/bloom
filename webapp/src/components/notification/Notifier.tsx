import {useEffect} from "react"
import {notifications} from "@mantine/notifications"
import {IconCircleCheck, IconExclamationCircle} from "@tabler/icons-react"
import {useMantineTheme} from "@mantine/core"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"
import useHistoryTaskStore from "../../stores/taskHistoryStore.ts"

const showLoadedNotification = (iconColor: string, message: string) => {
    notifications.show({
        title: "Action successful",
        message: message,
        withCloseButton: true,
        withBorder: true,
        icon: <IconCircleCheck color={iconColor}/>,
        color: "green",
        radius: "md"
    })
}

const showErrorNotification = (iconColor: string, message: string) => {
    notifications.show({
        title: "An error has occurred",
        message: message,
        withCloseButton: true,
        withBorder: true,
        icon: <IconExclamationCircle color={iconColor}/>,
        color: "red",
        radius: "md"
    })
}

export default function Notifier() {
    const theme = useMantineTheme()
    const iconColor = theme.colors.gray[9]

    const {
        loadedDetails: currentTaskStoreLoadedDetails,
        errorDetails: currentTaskStoreErrorDetails
    } = useCurrentTaskStore((state) => ({
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
    const {
        loadedDetails: historyTaskStoreLoadedDetails,
        errorDetails: historyTaskStoreErrorDetails
    } = useHistoryTaskStore((state) => ({
        loadedDetails: state.loadedDetails,
        errorDetails: state.errorDetails,
    }))

    useEffect(() => {
        if (currentTaskStoreLoadedDetails) {
            showLoadedNotification(iconColor, currentTaskStoreLoadedDetails)
        }

        if (currentTaskStoreErrorDetails) {
            showErrorNotification(iconColor, currentTaskStoreErrorDetails)
        }

        if (categoryStoreLoadedDetails) {
            showLoadedNotification(iconColor, categoryStoreLoadedDetails)
        }

        if (categoryStoreErrorDetails) {
            showErrorNotification(iconColor, categoryStoreErrorDetails)
        }

        if (historyTaskStoreLoadedDetails) {
            showLoadedNotification(iconColor, historyTaskStoreLoadedDetails)
        }

        if (historyTaskStoreErrorDetails) {
            showErrorNotification(iconColor, historyTaskStoreErrorDetails)
        }
    }, [
        currentTaskStoreLoadedDetails,
        currentTaskStoreErrorDetails,
        categoryStoreLoadedDetails,
        categoryStoreErrorDetails,
        historyTaskStoreLoadedDetails,
        historyTaskStoreErrorDetails
    ])

    return (<></>)
}
