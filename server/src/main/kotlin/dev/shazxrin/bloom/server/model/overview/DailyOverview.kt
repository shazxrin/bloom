package dev.shazxrin.bloom.server.model.overview

data class DailyOverview(
    val categories: Iterable<CategoryTotalDuration>
)
