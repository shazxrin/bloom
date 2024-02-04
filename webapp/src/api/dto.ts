export interface CreateCategoryDto {
    name: string
    color: string
}

export interface ListCategoryDto {
    id: string
    name: string
    color: string
}

export interface UpdateCategoryDto {
    name: string
    color: string
}

export interface PagedListDto<T> {
    page: number
    totalPages: number
    items: Array<T>
}

export interface CreateCurrentTaskDto {
    name: string
    categoryId: string
    duration: number
}

export interface CurrentTaskDto {
    name: string
    categoryId: string
    duration: number
    remainingDuration: number
    isPaused: boolean
    startTime: string
    lastStartTime: string
}

export interface ListTaskDto {
    id: string
    name: string
    categoryId: string
    duration: number
    startTime: string
    endTime?: string
}

export interface AddTaskDto {
    name: string
    categoryId: string
    duration: number
    startTime: string
    endTime: string
}

export interface UpdateTaskDto {
    name?: string | undefined
    categoryId?: string | undefined
    duration?: number | undefined
    startTime?: string | undefined
    endTime?: string | undefined
}

export interface CategoryTotalDurationDto {
    categoryId: string
    totalDuration: number
}

export interface DateTotalDurationDto {
    date: string
    totalDuration: number
}

export interface DailyOverviewDto {
    categories: Array<CategoryTotalDurationDto>
}

export interface WeeklyOverviewDto {
    categories: Array<CategoryTotalDurationDto>
    dates: Array<DateTotalDurationDto>
}

export interface YearlyOverviewDto {
    dates: Array<DateTotalDurationDto>
}
