import {CategoryTotalDurationDto, DateTotalDurationDto} from "../api/dto.ts"
import API from "../api/api.ts"
import {create} from "zustand"
import {devtools} from "zustand/middleware"
import {formatDate, getTodayDate} from "../utils/dateTimeUtils.ts"

interface OverviewStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    dailyOverviewDate: Date
    setDailyOverviewDate: (date: Date) => Promise<void>
    dailyOverview: Array<CategoryTotalDurationDto>
    weeklyOverview: Array<DateTotalDurationDto>
    yearlyOverview: Array<DateTotalDurationDto>
    getDailyOverview: () => Promise<void>
    getWeeklyOverview: () => Promise<void>
    getYearlyOverview: () => Promise<void>
}

const useOverviewStore = create<OverviewStore>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            loadedDetails: null,
            errorDetails: null,
            dailyOverviewDate: getTodayDate(),
            setDailyOverviewDate: async (date: Date) => {
                set((state) => ({...state, dailyOverviewDate: date}))

                await get().getDailyOverview()
            },
            dailyOverview: [],
            weeklyOverview: [],
            yearlyOverview: [],
            getDailyOverview: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const dailyOverview = await API.overviews.getDaily(formatDate(get().dailyOverviewDate))

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
