package me.shazxrin.bloom.server.dto.common

import me.shazxrin.bloom.server.model.PagedList

data class PagedListDto<T>(
    val page: Int,
    val totalPages: Int,
    val items: List<T>
)

fun <T, R> PagedList<T>.map(mapper: (T) -> R): PagedListDto<R> {
    return PagedListDto(
        this.page,
        this.totalPages,
        items.map(mapper)
    )
}