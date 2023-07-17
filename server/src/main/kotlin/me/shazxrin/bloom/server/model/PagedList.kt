package me.shazxrin.bloom.server.model

data class PagedList<T>(
    val page: Int,
    val totalPages: Int,
    val items: List<T>
)
