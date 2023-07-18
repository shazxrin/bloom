import {useEffect} from "react"
import {notifications} from "@mantine/notifications"
import {IconCircleCheck, IconExclamationCircle} from "@tabler/icons-react"
import {useMantineTheme} from "@mantine/core"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"
import useHistoryTaskStore from "../../stores/taskHistoryStore.ts"

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
            notifications.show({
                title: "Action successful",
                message: currentTaskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck color={iconColor}/>,
                color: "green",
                radius: "md"
            })
        }

        if (currentTaskStoreErrorDetails) {
            notifications.show({
                title: "An error has occurred",
                message: currentTaskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconExclamationCircle color={iconColor}/>,
                color: "red",
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

        if (historyTaskStoreLoadedDetails) {
            notifications.show({
                title: "Action successful",
                message: historyTaskStoreLoadedDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconCircleCheck color={iconColor}/>,
                color: "green",
                radius: "md"
            })
        }


        if (historyTaskStoreErrorDetails) {
            notifications.show({
                title: "An error has occurred",
                message: historyTaskStoreErrorDetails,
                withCloseButton: true,
                withBorder: true,
                icon: <IconExclamationCircle color={iconColor}/>,
                color: "red",
                radius: "md"
            })
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
