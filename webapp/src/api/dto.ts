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
