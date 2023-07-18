import {create} from "zustand"
import {devtools} from "zustand/middleware"
import API from "../api/api.ts"
import {ListTaskDto} from "../api/dto.ts"

interface HistoryTaskStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    tasks: ListTaskDto[]
    page: number
    totalPages: number
    getAllTasks: (page: number) => Promise<void>
    addTask: (name: string, categoryId: string, duration: number, startTime: string) => Promise<void>
    updateTask: (id: string, name?: string | undefined, categoryId?: string | undefined, duration?: number | undefined, startTime?: string | undefined) => Promise<void>
    deleteTask: (id: string) => Promise<void>
}

const useHistoryTaskStore = create<HistoryTaskStore>()(
    devtools(
        (set , get) => ({
            isLoading: false,
            loadedDetails: null,
            errorDetails: null,
            tasks: [],
            page: 1,
            totalPages: 0,
            getAllTasks: async (page: number) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const pagedList = await API.tasks.getAll(page)

                    set((state) => ({
                        ...state,
                        tasks: pagedList.items,
                        page: pagedList.page,
                        totalPages: pagedList.totalPages,
                        loadedDetails: null,
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch all tasks",
                        isLoading: false
                    }))
                }
            },
            addTask: async (name: string, categoryId: string, duration: number, startTime: string) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.post({
                        name: name,
                        categoryId: categoryId,
                        duration: duration,
                        startTime: startTime
                    })

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully added task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to add task",
                        isLoading: false
                    }))
                }

                await get().getAllTasks(get().page)
            },
            updateTask: async (id: string, name?: string | undefined, categoryId?: string | undefined, duration?: number | undefined, startTime?: string | undefined) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.patch(id, {
                        name: name,
                        categoryId: categoryId,
                        duration: duration,
                        startTime: startTime
                    })

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully updated task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to update task",
                        isLoading: false
                    }))
                }

                await get().getAllTasks(get().page)
            },
            deleteTask: async (id: string) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.tasks.delete(id)

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully deleted task",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to delete task",
                        isLoading: false
                    }))
                }

                await get().getAllTasks(get().page)
            }
        })
    )
)

export default useHistoryTaskStore
