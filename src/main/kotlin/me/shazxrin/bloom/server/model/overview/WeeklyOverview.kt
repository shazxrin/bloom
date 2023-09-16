package me.shazxrin.bloom.server.model.overview

data class WeeklyOverview(
    val categories: Iterable<CategoryTotalDuration>,
    val dates: Iterable<DateTotalDuration>
)
