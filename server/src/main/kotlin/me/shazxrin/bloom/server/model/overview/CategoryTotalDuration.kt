package me.shazxrin.bloom.server.model.overview

import me.shazxrin.bloom.server.model.category.Category

data class CategoryTotalDuration(
    val category: Category,
    val totalDuration: Long
)