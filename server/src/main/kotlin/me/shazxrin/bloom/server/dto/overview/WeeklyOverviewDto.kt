package me.shazxrin.bloom.server.dto.overview


data class WeeklyOverviewDto(
    val categories: List<CategoryTotalDurationDto>,
    val dates: List<DateTotalDurationDto>
)
