package me.shazxrin.bloom.server.model

data class WeeklyOverview(
    val categories: Iterable<CategoryTotalDuration>,
    val dates: Iterable<DateTotalDuration>
)
