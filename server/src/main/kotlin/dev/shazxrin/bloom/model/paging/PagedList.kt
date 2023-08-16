package dev.shazxrin.bloom.model.paging

data class PagedList<T>(
    val page: Int,
    val totalPages: Int,
    val items: Iterable<T>
)
