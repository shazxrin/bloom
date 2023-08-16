package dev.shazxrin.bloom.model.overview

data class WeeklyOverview(
    val categories: Iterable<CategoryTotalDuration>,
    val dates: Iterable<DateTotalDuration>
)
