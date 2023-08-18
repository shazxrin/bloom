package dev.shazxrin.bloom.server.model.overview

import dev.shazxrin.bloom.server.model.category.Category

data class CategoryTotalDuration(
    val category: Category,
    val totalDuration: Long
)