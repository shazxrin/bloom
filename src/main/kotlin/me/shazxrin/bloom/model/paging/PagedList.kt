package me.shazxrin.bloom.model.paging

data class PagedList<T>(
    val page: Int,
    val totalPages: Int,
    val items: List<T>
)
