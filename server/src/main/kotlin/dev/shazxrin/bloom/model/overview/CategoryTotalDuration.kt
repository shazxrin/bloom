package dev.shazxrin.bloom.model.overview

import dev.shazxrin.bloom.model.category.Category

data class CategoryTotalDuration(
    val category: Category,
    val totalDuration: Long
)