import {CurrentTaskDto, PagedListDtoListTaskDto, TaskControllerApi} from "../api";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

interface TaskStore {
    isLoading: boolean
    currentTask: CurrentTaskDto | null
    fetchCurrentTask: () => Promise<void>
    createCurrentTask: (name: string, categoryId: string, duration: number) => Promise<void>
    pauseCurrentTask: () => Promise<void>
    resumeCurrentTask: () => Promise<void>
    endCurrentTask: () => Promise<void>
    getAllTasks: (page: number) => Promise<PagedListDtoListTaskDto>
}

export const useTaskStore = create<TaskStore>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            hasError: false,
            errorMessage: null,
            categories: [],
            currentTask: null,
            fetchCurrentTask: async () => {
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

                get().fetchCurrentTask()
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

                get().fetchCurrentTask()
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

                get().fetchCurrentTask()
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

                get().fetchCurrentTask()
            },
            getAllTasks: async (page: number): Promise<PagedListDtoListTaskDto> => {
                set((state) => ({...state, isLoading: true}))

                const tasksApi = new TaskControllerApi()
                const response = await tasksApi.getAllTasks({
                    page: page
                })

                return response.data
            },
        })
    )
)
