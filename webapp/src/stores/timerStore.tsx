import {create} from "zustand";
import {
    CategoryControllerApi,
    CurrentTaskDto,
    ListCategoryDto,
    TaskControllerApi
} from "../api";
import {devtools} from "zustand/middleware";

interface TimerStore {
    isLoading: boolean
    hasError: boolean
    categories: ListCategoryDto[]
    currentTask: CurrentTaskDto | null
    initialize: () => void
    createCurrentTask: (name: string, categoryId: string, duration: number) => void
    pauseCurrentTask: () => void
    resumeCurrentTask: () => void
    endCurrentTask: () => void
    createCategory: (name: string, color: string) => void
}

export const useTimerStore = create<TimerStore>()(
    devtools(
        (set) => ({
            isLoading: false,
            hasError: false,
            errorMessage: null,
            categories: [],
            currentTask: null,
            initialize: async () => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const tasksResponse = await tasksApi.getCurrentTask()

                if (tasksResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        currentTask: tasksResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else if (tasksResponse.status == 204) {
                    set((state) => ({
                        ...state,
                        currentTask: null,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const categoryApi = new CategoryControllerApi()
                const categoriesResponse = await categoryApi.getAllCategories()

                if (categoriesResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        categories: categoriesResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            },
            createCurrentTask: async (name: string, categoryId: string, duration: number) => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const createResponse = await tasksApi.postCreateCurrentTask({
                    createCurrentTaskDto: {
                        name: name,
                        categoryId: categoryId,
                        duration: duration
                    }
                })

                if (createResponse.status == 201) {
                    set((state) => ({...state, isLoading: false, hasError: false}))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const fetchResponse = await tasksApi.getCurrentTask()

                if (fetchResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        currentTask: fetchResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else if (fetchResponse.status == 204) {
                    set((state) => ({
                        ...state,
                        currentTask: null,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            },
            pauseCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const response = await tasksApi.postPauseCurrentTask()

                if (response.status == 200) {
                    set((state) => ({...state, isLoading: false, hasError: false}))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const fetchResponse = await tasksApi.getCurrentTask()

                if (fetchResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        currentTask: fetchResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else if (fetchResponse.status == 204) {
                    set((state) => ({
                        ...state,
                        currentTask: null,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            },
            resumeCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const response = await tasksApi.postResumeCurrentTask()

                if (response.status == 200) {
                    set((state) => ({...state, isLoading: false, hasError: false}))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const fetchResponse = await tasksApi.getCurrentTask()

                if (fetchResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        currentTask: fetchResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else if (fetchResponse.status == 204) {
                    set((state) => ({
                        ...state,
                        currentTask: null,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            },
            endCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const response = await tasksApi.postEndCurrentTask()

                if (response.status == 200) {
                    set((state) => ({...state, isLoading: false, hasError: false}))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const fetchResponse = await tasksApi.getCurrentTask()

                if (fetchResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        currentTask: fetchResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else if (fetchResponse.status == 204) {
                    set((state) => ({
                        ...state,
                        currentTask: undefined,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            },
            createCategory: async (name: string, color: string) => {
                set((state) => ({...state, isLoading: true}))

                const categoryApi = new CategoryControllerApi()
                const response = await categoryApi.postCreateCategory({
                    createCategoryDto: {
                        name: name,
                        color: color
                    }
                })

                if (response.status == 200) {
                    set((state) => ({...state, isLoading: false, hasError: false}))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }

                set((state) => ({...state, isLoading: true}))

                const fetchResponse = await categoryApi.getAllCategories()

                if (fetchResponse.status == 200) {
                    set((state) => ({
                        ...state,
                        categories: fetchResponse.data,
                        isLoading: false,
                        hasError: false
                    }))
                } else {
                    set((state) => ({...state, isLoading: false, hasError: true}))
                }
            }
        })
    )
)
