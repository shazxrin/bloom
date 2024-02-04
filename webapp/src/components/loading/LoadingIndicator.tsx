import {Loader} from "@mantine/core"
import {useEffect, useState} from "react"
import useCurrentTaskStore from "../../stores/currentTaskStore.ts"
import useHistoryTaskStore from "../../stores/taskHistoryStore.ts"
import useCategoryStore from "../../stores/categoryStore.ts"
import useOverviewStore from "../../stores/overviewStore.ts"

export default function LoadingIndicator() {
    const [isLoading, setIsLoading] = useState(false)

    const {isLoading: isLoadingCurrentTaskStore} = useCurrentTaskStore((state) => ({
        isLoading: state.isLoading
    }))
    const {isLoading: isLoadingHistoryTaskStore} = useHistoryTaskStore((state) => ({
        isLoading: state.isLoading
    }))
    const {isLoading: isLoadingCategoryStore} = useCategoryStore((state) => ({
        isLoading: state.isLoading
    }))
    const {isLoading: isLoadingOverviewStore} = useOverviewStore((state) => ({
        isLoading: state.isLoading
    }))

    useEffect(() => {
        setIsLoading(isLoadingCurrentTaskStore || isLoadingHistoryTaskStore || isLoadingCategoryStore || isLoadingOverviewStore)
    }, [
        isLoadingCurrentTaskStore,
        isLoadingHistoryTaskStore,
        isLoadingCategoryStore,
        isLoadingOverviewStore
    ])

    return (
        <>
            {
                isLoading && <Loader size={"sm"} variant={"dots"}/>
            }
        </>
    )
}