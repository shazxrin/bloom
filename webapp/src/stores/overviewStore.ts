import {CategoryTotalDurationDto, DateTotalDurationDto} from "../api/dto.ts"
import API from "../api/api.ts"
import {create} from "zustand"
import {devtools} from "zustand/middleware"

interface OverviewStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    dailyOverview: Array<CategoryTotalDurationDto>
    weeklyOverview: Array<DateTotalDurationDto>
    yearlyOverview: Array<DateTotalDurationDto>
    getDailyOverview: () => Promise<void>
    getWeeklyOverview: () => Promise<void>
    getYearlyOverview: () => Promise<void>
}

const useOverviewStore = create<OverviewStore>()(
    devtools(
        (set) => ({
            isLoading: false,
            loadedDetails: null,
            errorDetails: null,
            dailyOverview: [],
            weeklyOverview: [],
            yearlyOverview: [],
            getDailyOverview: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const dailyOverview = await API.overviews.getDaily()

                    set((state) => ({
                        ...state,
                        dailyOverview: dailyOverview,
                        loadedDetails: null,
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch categories",
                        isLoading: false
                    }))
                }
            },
            getWeeklyOverview: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const weeklyOverview = await API.overviews.getWeekly()

                    set((state) => ({
                        ...state,
                        weeklyOverview: weeklyOverview,
                        loadedDetails: null,
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch categories",
                        isLoading: false
                    }))
                }
            },
            getYearlyOverview: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const yearlyOverview = await API.overviews.getYearly()

                    set((state) => ({
                        ...state,
                        yearlyOverview: yearlyOverview,
                        loadedDetails: null,
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch categories",
                        isLoading: false
                    }))
                }
            }
        })
    )
)

export default useOverviewStore
