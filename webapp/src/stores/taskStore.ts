import {create} from "zustand";
import {devtools} from "zustand/middleware";
import API from "../api/api.ts";
import {CurrentTaskDto, ListTaskDto, PagedListDto} from "../api/dto.ts";

interface TaskStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    currentTask: CurrentTaskDto | null
    fetchCurrentTask: () => Promise<void>
    createCurrentTask: (name: string, categoryId: string, duration: number) => Promise<void>
    pauseCurrentTask: () => Promise<void>
    resumeCurrentTask: () => Promise<void>
    endCurrentTask: () => Promise<void>
    getAllTasks: (page: number) => Promise<PagedListDto<ListTaskDto> | null>
}

export const useTaskStore = create<TaskStore>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            loadedDetails: null,
            errorDetails: null,
            categories: [],
            currentTask: null,
            fetchCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const currentTask = await API.tasks.getCurrent()

                    set((state) => ({
                        ...state,
                        currentTask: currentTask,
                        loadedDetails: "Successfully fetched current task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch current task",
                        isLoading: false
                    }))
                }
            },
            createCurrentTask: async (name: string, categoryId: string, duration: number) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.postCurrentCreate({
                        name: name,
                        categoryId: categoryId,
                        duration: duration
                    })

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully created current task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch current task",
                        isLoading: false
                    }))
                }

                await get().fetchCurrentTask()
            },
            pauseCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.postCurrentPause()

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully paused current task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to pause current task",
                        isLoading: false
                    }))
                }

                await get().fetchCurrentTask()
            },
            resumeCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.postCurrentResume()

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully resumed current task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to resume current task",
                        isLoading: false
                    }))
                }

                await get().fetchCurrentTask()
            },
            endCurrentTask: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.postCurrentEnd()

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully ended current task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to end current task",
                        isLoading: false
                    }))
                }

                await get().fetchCurrentTask()
            },
            getAllTasks: async (page: number) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const pagedList = await API.tasks.getAll(page)

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully fetched all tasks",
                        errorDetails: null,
                        isLoading: false
                    }))

                    return pagedList
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch all tasks",
                        isLoading: false
                    }))

                    return null
                }
            },
        })
    )
)
