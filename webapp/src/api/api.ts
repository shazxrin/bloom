import {
    AddTaskDto, CategoryTotalDurationDto,
    CreateCategoryDto,
    CreateCurrentTaskDto,
    CurrentTaskDto, DateTotalDurationDto,
    ListCategoryDto,
    ListTaskDto,
    PagedListDto,
    UpdateCategoryDto, UpdateTaskDto
} from "./dto.ts"
import axios, {HttpStatusCode} from "axios"

class ApiError extends Error {
    constructor() {
        super()
    }
}

interface TasksApi {
    getAll(page: number, categoryId?: string | undefined): Promise<PagedListDto<ListTaskDto>>

    getCurrent(): Promise<CurrentTaskDto | null>

    postCurrentCreate(createCurrentTaskDto: CreateCurrentTaskDto): Promise<void>

    postCurrentEnd(): Promise<void>

    postCurrentPause(): Promise<void>

    postCurrentResume(): Promise<void>

    post(addTaskDto: AddTaskDto): Promise<void>

    patch(id: string, updateTaskDto: UpdateTaskDto): Promise<void>

    delete(id: string): Promise<void>
}

interface CategoriesApi {
    post(createCategoryDto: CreateCategoryDto): Promise<void>

    getAll(): Promise<Array<ListCategoryDto>>

    patch(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void>

    delete(id: string): Promise<void>
}

interface OverviewsApi {
    getDaily(): Promise<Array<CategoryTotalDurationDto>>

    getWeekly(): Promise<Array<DateTotalDurationDto>>

    getYearly(): Promise<Array<DateTotalDurationDto>>
}

const tasksApi: TasksApi = {
    getAll: async (page: number, categoryId?: string | undefined) => {
        try {
            const response = await axios.get<PagedListDto<ListTaskDto>>(
                "/api/tasks/all",
                {
                    params: {
                        page: page,
                        categoryId: categoryId
                    }
                }
            )

            return response.data
        } catch (err) {
            throw new ApiError()
        }
    },
    getCurrent: async () => {
        try {
            const response = await axios.get<CurrentTaskDto>("/api/tasks/current")

            if (response.status == HttpStatusCode.Ok) {
                return response.data
            }

            return null
        } catch (err) {
            throw new ApiError()
        }
    },
    postCurrentCreate: async (createCurrentTaskDto: CreateCurrentTaskDto) => {
        try {
            await axios.post<void, void, CreateCurrentTaskDto>("api/tasks/current/create", createCurrentTaskDto)
        } catch (err) {
            throw new ApiError()
        }
    },
    postCurrentEnd: async () => {
        try {
            await axios.post<void>("api/tasks/current/end")
        } catch (err) {
            throw new ApiError()
        }
    },
    postCurrentPause: async () => {
        try {
            await axios.post<void>("api/tasks/current/pause")
        } catch (err) {
            throw new ApiError()
        }
    },
    postCurrentResume: async () => {
        try {
            await axios.post<void>("api/tasks/current/resume")
        } catch (err) {
            throw new ApiError()
        }
    },
    post: async (addTaskDto: AddTaskDto) => {
        try {
            await axios.post<void, void, AddTaskDto>("api/tasks", addTaskDto)
        } catch (err) {
            throw new ApiError()
        }
    },
    patch: async (id: string, updateTaskDto: UpdateTaskDto) => {
        try {
            await axios.patch<void, void, UpdateTaskDto>(`api/tasks/${id}`, updateTaskDto)
        } catch (err) {
            throw new ApiError()
        }
    },
    delete: async (id: string) => {
        try {
            await axios.delete<void>(`api/tasks/${id}`)
        } catch (err) {
            throw new ApiError()
        }
    }
}

const categoriesApi: CategoriesApi = {
    post: async (createCategoryDto: CreateCategoryDto) => {
        try {
            await axios.post<void, void, CreateCategoryDto>("api/categories", createCategoryDto)
        } catch (err) {
            throw new ApiError()
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get<Array<ListCategoryDto>>("/api/categories/all")

            return response.data
        } catch (err) {
            throw new ApiError()
        }
    },
    patch: async (id: string, updateCategoryDto: UpdateCategoryDto) => {
        try {
            await axios.patch<void, void, UpdateCategoryDto>(
                `api/categories/${id}`,
                updateCategoryDto
            )
        } catch (err) {
            throw new ApiError()
        }
    },
    delete: async (id: string) => {
        try {
            await axios.delete<void>(`api/categories/${id}`)
        } catch (err) {
            throw new ApiError()
        }
    }
}

const overviewsApi: OverviewsApi = {
    getDaily: async () => {
        try {
            const response = await axios.get<Array<CategoryTotalDurationDto>>("/api/overviews/daily")

            return response.data
        } catch (err) {
            throw new ApiError()
        }
    },
    getWeekly: async () => {
        try {
            const response = await axios.get<Array<DateTotalDurationDto>>("/api/overviews/weekly")

            return response.data
        } catch (err) {
            throw new ApiError()
        }
    },
    getYearly: async () => {
        try {
            const response = await axios.get<Array<DateTotalDurationDto>>("/api/overviews/yearly")

            return response.data
        } catch (err) {
            throw new ApiError()
        }
    }
}

const API = {
    tasks: tasksApi,
    categories: categoriesApi,
    overviews: overviewsApi
}

export default API
