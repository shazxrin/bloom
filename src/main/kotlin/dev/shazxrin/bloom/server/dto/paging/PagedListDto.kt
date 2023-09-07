package dev.shazxrin.bloom.server.dto.paging

import dev.shazxrin.bloom.server.model.paging.PagedList

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