import {
    DailyOverviewDto,
    WeeklyOverviewDto,
    YearlyOverviewDto
} from "../api/dto.ts"
import API from "../api/api.ts"
import {create} from "zustand"
import {devtools} from "zustand/middleware"
import {formatDate, getTodayDate} from "../utils/dateTimeUtils.ts"

interface OverviewStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    dailyOverviewDate: Date
    weeklyOverviewDate: Date
    setDailyOverviewDate: (date: Date) => Promise<void>
    setWeeklyOverviewDate: (date: Date) => Promise<void>
    dailyOverview: DailyOverviewDto
    weeklyOverview: WeeklyOverviewDto
    yearlyOverview: YearlyOverviewDto
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
            weeklyOverviewDate: getTodayDate(),
            setDailyOverviewDate: async (date: Date) => {
                set((state) => ({...state, dailyOverviewDate: date}))

                await get().getDailyOverview()
            },
            setWeeklyOverviewDate: async (date: Date) => {
                set((state) => ({...state, weeklyOverviewDate: date}))

                await get().getWeeklyOverview()
            },
            dailyOverview: {categories: []},
            weeklyOverview: {categories: [], dates: []},
            yearlyOverview: {dates: []},
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
                        errorDetails: "Failed to fetch daily overview",
                        isLoading: false
                    }))
                }
            },
            getWeeklyOverview: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const weeklyOverview = await API.overviews.getWeekly(formatDate(get().weeklyOverviewDate))

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
                        errorDetails: "Failed to fetch weekly overview",
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
                        errorDetails: "Failed to fetch yearly overview",
                        isLoading: false
                    }))
                }
            }
        })
    )
)

export default useOverviewStore
